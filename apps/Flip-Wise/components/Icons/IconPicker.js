import { useState } from "react";
import styled from "styled-components";
import { ICONS } from "@/components/Icons/giIcons";

export default function IconPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = ICONS.find((i) => i.name === value);

  return (
    <PickerContainer>
      <PickerButton type="button" onClick={() => setIsOpen(!isOpen)}>
        {selected ? (
          <>
            <selected.Icon /> {selected.label}
          </>
        ) : (
          "Please select an icon"
        )}
      </PickerButton>
      {isOpen && (
        <OptionList>
          {ICONS.map(({ name, label, Icon }) => (
            <OptionItem
              key={name}
              onClick={() => {
                onChange(name);
                setIsOpen(false);
              }}
            >
              <Icon /> {label}
            </OptionItem>
          ))}
        </OptionList>
      )}
      <input type="hidden" name="icon" value={value || ""} />
    </PickerContainer>
  );
}

const PickerContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;

const PickerButton = styled.button`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #222;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 0.95rem;
  background: #fff;
  color: #222;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
`;

const OptionList = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid #222;
  border-radius: 10px;
  background: #fff;
  z-index: 1000;
  //   overflow: hidden;
  margin-bottom: 4px;
`;

const OptionItem = styled.div`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: "Nunito", sans-serif;

  &:hover {
    background: #f0ede8;
  }
`;
