// ✅ toast.js
import Swal from "sweetalert2";

const baseToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
    customClass: {
        popup: "rounded-4 border-0 p-2",
        title: "fw-semibold",
    },
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

export const Toast = {
    success(message) {
        baseToast.fire({
            icon: "success",
            title: message || "Action réussie ✅",
        });
    },

    error(message) {
        baseToast.fire({
            icon: "error",
            title: message || "Une erreur est survenue ❌",
        });
    },

    warning(message) {
        baseToast.fire({
            icon: "warning",
            title: message || "Attention ⚠️",
        });
    },

    info(message) {
        baseToast.fire({
            icon: "info",
            title: message || "Information ℹ️",
        });
    },
};


export async function confirmAlert({
    title = "Êtes-vous sûr ?",
    text = "Cette action est irréversible !",
    confirmButtonText = "Oui",
    cancelButtonText = "Annuler",
    icon = "warning",
}) {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText,
        cancelButtonText,
    });

    return result.isConfirmed;
}

export function showLoadingModal() {
    const modal = document.getElementById("my_modal_1");
    if (modal) {
        modal.showModal();
    }
}

export function hideLoadingModal() {
    const modal = document.getElementById("my_modal_1");
    if (modal) {
        modal.close();
    }
}
