// Input.js
import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  border-radius: 1rem;
  border: 2px solid #d1d5db;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2);
    outline: none;
  }
`;

export default function Input({ label, placeholder, width = "100%", ...props }) {
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: "0.5rem" , alignItems:"flex-start"}}>
      {label && (
        <label style={{ fontWeight: 500, color: "#374151", fontSize: "0.95rem" }}>
          {label}
        </label>
      )}
      <StyledInput placeholder={placeholder} {...props} />
    </div>
  );
}
