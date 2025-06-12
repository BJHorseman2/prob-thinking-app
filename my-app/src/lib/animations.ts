export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
}

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
}

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(139, 92, 246, 0)",
      "0 0 40px rgba(139, 92, 246, 0.3)",
      "0 0 20px rgba(139, 92, 246, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0 rgba(139, 92, 246, 0)"
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export const tabIndicator = {
  layoutId: "activeTab",
  transition: {
    type: "spring",
    stiffness: 500,
    damping: 30
  }
}

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const modalContent = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

export const successBounce = {
  initial: { scale: 0 },
  animate: { 
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
      ease: "easeOut"
    }
  }
}

export const errorShake = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}

export const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
}

export const rotateIn = {
  initial: { rotate: -180, opacity: 0 },
  animate: { 
    rotate: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200
    }
  }
}

export const blurIn = {
  initial: { filter: "blur(10px)", opacity: 0 },
  animate: { 
    filter: "blur(0px)", 
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
} 