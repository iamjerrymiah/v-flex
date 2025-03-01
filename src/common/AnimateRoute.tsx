import React from 'react'
import { motion } from "framer-motion"

const animation = {
    initial: { opacity: 0, y: 2 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 1, y: -2 }
}

function AnimateRoute({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={animation}
            initial="initial"
            animate="animate"
            transition={{duration: 0.5}}
        >
            {children}
        </motion.div>
    )
}

export default AnimateRoute