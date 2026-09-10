import { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormReset } from "react-hook-form";
import { showAppToast } from "@/lib/toast";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import {
  applyUniverseDraft,
  buildUniverseDraft,
  collectUniverseDraftFileIds,
  migrateUniverseDraft,
  sanitizeUniverseDraft,
} from "@/schema/universeDraft.schema";
import { useDraftCreateMutation } from "@/api/draft/postDraftCreate";
import { useDraftUpdateMutation } from "@/api/draft/putDraftUpdate";
import { useDraftCurrentQuery } from "@/api/draft/getDraftCurrent";
import { useDraftMutation } from "@/api/draft/getDraft";

interface UseUniverseDraftParams {
  // 이미 만들어진 세계관을 수정하는 화면에는 초안 기능 자체가 없어, 새로 만드는 흐름에서만 켭니다.
  enabled: boolean;
  defaultScenarioName: string;
  getValues: () => CharacterCreateFormValues;
  reset: UseFormReset<CharacterCreateFormValues>;
}

/**
 * 캐릭터 생성 폼의 "임시저장 → 불러오기" 흐름을 한 곳에 모아둔 훅입니다.
 * 백엔드에는 type: "UNIVERSE" 초안으로 저장/조회됩니다.
 */
export const useUniverseDraft = ({
  enabled,
  defaultScenarioName,
  getValues,
  reset,
}: UseUniverseDraftParams) => {
  const t = useTranslations("characterCreate");

  // 초안 id는 이번 세션에서 새로 만든 것(createdDraftId)을 우선하고, 없으면
  // 서버가 이미 갖고 있던 초안(currentDraft)을 씁니다. useEffect로 동기화하지 않고
  // 파생 상태로 두어야 set-state-in-effect 없이도 항상 최신 값을 반영합니다.
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(null);
  const { data: currentDraft, refetch: refetchCurrentDraft } =
    useDraftCurrentQuery("UNIVERSE", enabled);
  const draftId = createdDraftId ?? currentDraft?.draftId ?? null;

  const { mutateAsync: createDraft } = useDraftCreateMutation();
  const { mutateAsync: updateDraft } = useDraftUpdateMutation();
  const { mutateAsync: fetchDraft } = useDraftMutation();

  /** "임시저장" 버튼 클릭 시 호출합니다. 기존 초안이 있으면 갱신, 없으면 새로 만듭니다. */
  const saveDraft = async () => {
    const currentValues = getValues();
    const draft = buildUniverseDraft(currentValues);
    const fileIds = collectUniverseDraftFileIds(draft);
    // 백엔드는 제목을 필수로 받는데, 임시저장은 제목을 채우기 전에도 눌러볼 수 있습니다.
    const title = currentValues.title.trim() || t("untitledDraftTitle");

    try {
      if (draftId) {
        await updateDraft({
          draftId,
          request: { title, payload: draft, fileIds },
        });
      } else {
        const created = await createDraft({
          type: "UNIVERSE",
          title,
          payload: draft,
          fileIds,
        });
        setCreatedDraftId(created.draftId);
      }
      reset(currentValues);
      showAppToast("success", t("draftSaved"));
    } catch (error) {
      console.error("Draft save failed:", error);
      showAppToast("error", t("draftSaveFailed"));
    }
  };

  /**
   * "불러오기" 확정 시 호출합니다. fallbackFormValues는 draft에 없는 필드를 채울
   * 기본 폼 값으로, 호출부(CharacterCreateForm)가 defaultScenarioName 기준으로 매번
   * 새로 만들어 넘겨줍니다 — 이 훅이 폼 기본값 생성 로직까지 알 필요는 없어서입니다.
   */
  const loadDraft = async (fallbackFormValues: CharacterCreateFormValues) => {
    // 페이지에 막 들어와 GET /drafts/current 응답이 아직 안 돌아온 시점에 눌렀을 수 있어,
    // 이미 아는 값이 없을 때만 그 자리에서 한 번 더 확인합니다.
    const targetDraftId =
      draftId ?? (await refetchCurrentDraft()).data?.draftId ?? null;

    if (!targetDraftId) {
      showAppToast("warning", t("draftNotFound"));
      return;
    }

    try {
      const draft = await fetchDraft(targetDraftId);
      // payload는 백엔드가 내부 구조를 검증하지 않는 자유 형식 JSON이라, 폼에 넣기 전에
      // 먼저 안전한 모양으로 정리(sanitize)한 뒤에만 버전 이관(migrate)을 적용합니다.
      const latest = migrateUniverseDraft(sanitizeUniverseDraft(draft.payload));

      reset({
        ...fallbackFormValues,
        ...applyUniverseDraft(latest, defaultScenarioName),
      });
    } catch (error) {
      console.error("Draft load failed:", error);
      showAppToast("error", t("draftLoadFailed"));
    }
  };

  return { draftId, saveDraft, loadDraft };
};
