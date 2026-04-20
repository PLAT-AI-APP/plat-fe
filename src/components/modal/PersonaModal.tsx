import React, { useState, useCallback, useEffect } from "react";
import PersonaHeader from "./persona/PersonaHeader";
import PersonaItem from "./persona/PersonaItem";
import PersonaFooter from "./persona/PersonaFooter";
import { ModalLayout } from "../ModalLayout";
import { useMePersonasQuery } from "@/api/persona/mePersonas";
import SkeletonPersona from "../skeleton/SkeletonPersona";

interface PersonaModalProps {
  closeModal: () => void;
}

const PersonaModal = ({ closeModal }: PersonaModalProps) => {
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

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCurrentPersona = useCallback((personaId: number) => {
    setSelectedId(personaId);
  }, []);

  // 실제 '로딩 중' 판단: 요청을 아직 안 보냈거나(!shouldFetch), 쿼리가 로딩 중일 때
  const isDataLoading = !shouldFetch || isLoading;

  return (
    <ModalLayout
      onClose={closeModal}
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark"
    >
      <PersonaHeader onClose={closeModal} />

      <div className="mt-4">
        {isDataLoading ? (
          <SkeletonPersona />
        ) : (
          <ul className="flex flex-col gap-4">
            {personas?.map((persona) => (
              <PersonaItem
                key={persona.personaId}
                persona={persona}
                isActive={selectedId === persona.personaId}
                onSelect={handleCurrentPersona}
              />
            ))}
          </ul>
        )}
        {!isDataLoading && <PersonaFooter />}
      </div>
    </ModalLayout>
  );
};

export default React.memo(PersonaModal);
