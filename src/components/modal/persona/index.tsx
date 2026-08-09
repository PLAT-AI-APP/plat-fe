import React, { useState, useCallback, useEffect } from "react";
import PersonaHeader from "./PersonaHeader";
import PersonaItem from "./PersonaItem";
import PersonaFooter from "./PersonaFooter";
import PersonaEmptyState from "./PersonaEmptyState";
import { ModalLayout } from "../../ModalLayout";
import { useMePersonasQuery } from "@/api/persona/mePersonas";
import SkeletonPersona from "../../skeleton/SkeletonPersona";

import { PersonaModalProps } from "@/type/modal";

const PersonaModal = ({ onClose }: PersonaModalProps) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    // 0ms 혹은 10ms 정도의 지연을 주어 동기적 업데이트 흐름을 끊습니다.
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 옵션 객체를 넘겨서 enabled 상태를 제어합니다.
  const { data: personas, isLoading } = useMePersonasQuery({
    enabled: shouldFetch,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasPersonas = Boolean(personas?.length);

  const handleCurrentPersona = useCallback((personaId: string) => {
    setSelectedId((prevSelectedId) =>
      prevSelectedId === personaId ? null : personaId,
    );
  }, []);

  // 실제 '로딩 중' 판단: 요청을 아직 안 보냈거나(!shouldFetch), 쿼리가 로딩 중일 때
  const isDataLoading = !shouldFetch || isLoading;

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="top-1/2 left-1/2 h-fit w-screen max-w-125 -translate-x-1/2 -translate-y-1/2 bg-dark p-5"
    >
      <PersonaHeader onClose={onClose} />

      <div className="mt-4">
        {isDataLoading ? (
          <SkeletonPersona />
        ) : !hasPersonas ? (
          <PersonaEmptyState />
        ) : (
          <ul className="flex flex-col gap-4">
            {personas?.map((persona) => (
              <PersonaItem
                key={persona.personaId}
                persona={persona}
                isActive={selectedId === persona.personaId}
                hasSelectedPersona={selectedId !== null}
                onSelect={handleCurrentPersona}
              />
            ))}
          </ul>
        )}
        {!isDataLoading && (
          <PersonaFooter isMaxPersona={(personas?.length ?? 0) >= 5} />
        )}
      </div>
    </ModalLayout>
  );
};

export default React.memo(PersonaModal);
