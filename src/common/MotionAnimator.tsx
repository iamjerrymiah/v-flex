import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface IMotionAnimatorProps {
    children: ReactNode;
    delay?: number;
    direction?: "left" | "right" | "up" | "down";
};

export const MotionAnimator: FC<IMotionAnimatorProps> = ({ children, delay = 0, direction = "up" }) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.8, delay },
        },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={variants}>
            {children}
        </motion.div>
    );
}
