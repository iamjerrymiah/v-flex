import { allLower } from "@/utils/utils"
import { statuses } from "./constants"

export const statusColor = (code: string) => {
    if (statuses['positive'].includes(allLower(code)) || statuses['positive'].includes(code)) {
        return 'whatsapp'
    } else if (statuses['pending'].includes(allLower(code)) || statuses['pending'].includes(code)) {
        return 'purple'
    } else if (statuses['negative'].includes(allLower(code)) || statuses['negative'].includes(code)) {
        return 'red'
    } else {
        return 'blackAlpha'
    }
}

export const ElementColor = {
    default: '#095CFC',
    white: '#FFF',
    black: '#000',
    lightBlack: "#494948",
    blue: "#095CFC",
}