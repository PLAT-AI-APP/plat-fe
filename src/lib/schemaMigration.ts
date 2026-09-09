/** schemaVersion 필드를 가진 임시저장 등 버전 관리 대상 데이터의 공통 형태 */
export interface VersionedSchema {
  schemaVersion: number;
}

/** 정확히 한 단계(v(n) -> v(n+1))만 변환하는 마이그레이션 함수 */
export type SchemaMigrationStep<
  TFrom extends VersionedSchema = VersionedSchema,
  TTo extends VersionedSchema = VersionedSchema,
> = (data: TFrom) => TTo;

/**
 * 체이닝 방식 스키마 마이그레이터를 만드는 팩토리.
 * migrations 배열은 인덱스 순서가 곧 버전 순서입니다.
 * migrations[0]은 v1 -> v2, migrations[1]은 v2 -> v3, ... 를 의미하며
 * 최신 버전은 항상 `migrations.length + 1`로 계산됩니다.
 *
 * 임시저장처럼 버전 관리가 필요한 API가 여러 개라면, API(도메인)마다 이 팩토리를
 * 한 번씩 호출해 각자의 migrate 함수를 만들어 쓰면 됩니다. 그렇게 만든 함수는
 * v1 데이터가 들어오면 v1 -> v2 -> v3 -> ... 순서로 한 단계씩 거쳐 최신 버전에 도달하며,
 * 중간 버전 하나라도 마이그레이션이 정의되어 있지 않거나 한 단계 이상 건너뛰면 에러를 던집니다.
 */
export const createSchemaMigrator = <
  TLatest extends VersionedSchema,
  TInput extends VersionedSchema = VersionedSchema,
>(
  migrations: SchemaMigrationStep[],
) => {
  const latestVersion = migrations.length + 1;

  return (data: TInput): TLatest => {
    let current: VersionedSchema = data;

    while (current.schemaVersion < latestVersion) {
      const step = migrations[current.schemaVersion - 1];
      if (!step) {
        throw new Error(
          `v${current.schemaVersion} -> v${current.schemaVersion + 1} 마이그레이션이 정의되어 있지 않습니다.`,
        );
      }

      const next = step(current);
      if (next.schemaVersion !== current.schemaVersion + 1) {
        throw new Error(
          `마이그레이션은 한 단계씩만 진행해야 합니다. (v${current.schemaVersion} -> v${next.schemaVersion} 시도됨)`,
        );
      }

      current = next;
    }

    return current as TLatest;
  };
};
