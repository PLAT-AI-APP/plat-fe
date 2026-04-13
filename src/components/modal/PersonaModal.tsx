import React, { useState, useCallback } from "react";
import PersonaHeader from "./persona/PersonaHeader";
import PersonaItem from "./persona/PersonaItem";
import PersonaFooter from "./persona/PersonaFooter";
import { ModalLayout } from "../ModalLayout";
import { useMePersonasQuery } from "@/api/persona/mePersonas";

interface PersonaModalProps {
  closeModal: () => void;
}

const PersonaModal = ({ closeModal }: PersonaModalProps) => {
  const { data: personas } = useMePersonasQuery();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCurrentPersona = useCallback((personaId: number) => {
    setSelectedId(personaId);
  }, []);

  if (!personas) return;
  return (
    <ModalLayout
      onClose={() => null}
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark"
    >
      <PersonaHeader onClose={closeModal} />

      <div>
        <ul className="flex flex-col gap-4">
          {personas.map((persona) => (
            <PersonaItem
              key={persona.personaId}
              persona={persona}
              isActive={selectedId === persona.personaId}
              onSelect={handleCurrentPersona}
            />
          ))}
        </ul>

        <PersonaFooter />
      </div>
    </ModalLayout>
  );
};

export default React.memo(PersonaModal);
