import styled from "styled-components";
import { StyledButton } from "/components/Button";
import { useState } from "react";
import IconPicker from "../Icons/IconPicker";
import BodyContainer from "../Container/BodyContainer";
import { addCollection, updateCollection } from "../Service/CollectionService";
import { useSession } from "next-auth/react";

export default function CollectionCardForm({ onClose, initialData = null }) {
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon ?? "");
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color ?? "#777"
  );
  const { data: session } = useSession();
  const isEditMode = initialData !== null;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (!data.icon) {
      alert("Please select an icon");
      return;
    }
    if (isEditMode) {
      await updateCollection(data, initialData.id);
    } else {
      data.owner = session.user.id;
      await addCollection(data);
    }
    onClose();
  }

  return (
    <CardContainer>
      <CardHeader>
        <Headline>
          {isEditMode ? "Edit Collection" : "Add new Collection"}
        </Headline>
      </CardHeader>
      <BodyContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              defaultValue={initialData?.name ?? ""}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="color">Color:</Label>
            <ColorRow>
              <Input
                type="color"
                id="color"
                name="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                required
              />
              <Input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#333"
              />
            </ColorRow>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="icon">Icon:</Label>
            <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
          </FormGroup>

          <Actions>
            <ButtonSubmit type="submit">
              {isEditMode ? "Save" : "Add"}
            </ButtonSubmit>
            <ButtonCancel type="button" onClick={onClose}>
              Cancel
            </ButtonCancel>
          </Actions>
        </form>
      </BodyContainer>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 100%;
  max-width: 420px;
  border: 3px solid #2d8c6e;
  border-radius: 20px;
  overflow: hidden;
  font-family: "Caveat", cursive;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CardHeader = styled.div`
  background-color: #2d8c6e;
  padding: 0.8rem 1.2rem;
`;

const Headline = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-family: "Caveat", cursive;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #222;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #222;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  font-size: 0.95rem;
  background: #fff;
  color: #222;
  outline: none;
  transition: box-shadow 0.15s;

  &:focus {
    box-shadow: 3px 3px 0 #b3a8e8;
  }
`;
const ColorRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 12px;
`;

const ButtonSubmit = styled(StyledButton)`
  background-color: #6b8f6e;
  color: #fff;

  &:hover {
    background: #5a7a5d;
  }
`;

const ButtonCancel = styled(StyledButton)`
  background: #fff;
  color: #222;

  &:hover {
    background: #f0ede8;
  }
`;
