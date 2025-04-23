import { useState } from "react"

export function useConfirmAction() {

    const [state, setState] = useState({
        isOpen: false,
        data: null
    } as any)

    const openConfirmModal = (params?: any) => {
        setState((prev:any) => ({ ...prev, data: params, isOpen: true }))
    }
    const closeConfirmModal = () => {
        setState((prev:any) => ({ ...prev, data: null, isOpen: false }))
    }

    return {
        openConfirm: (params?: any) => openConfirmModal(params),
        closeConfirm: () => closeConfirmModal(),
        isOpenConfirm: state.isOpen,
        current: state.data
    }
}