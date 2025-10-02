interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({
    open,
    title = "확인",
    message = "정말 저장하시겠습니까?",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!open) return null;
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.2)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "10px",
                    minWidth: "320px",
                    padding: "2rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    textAlign: "center",
                }}
            >
                <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}>{title}</div>
                <div style={{ marginBottom: "2rem" }}>{message}</div>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <button
                        style={{
                            padding: "0.5rem 1.5rem",
                            borderRadius: "6px",
                            border: "none",
                            background: "#1976d2",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                        onClick={onConfirm}
                    >
                        네
                    </button>
                    <button
                        style={{
                            padding: "0.5rem 1.5rem",
                            borderRadius: "6px",
                            border: "1px solid #bbb",
                            background: "#fff",
                            color: "#333",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                        onClick={onCancel}
                    >
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
};