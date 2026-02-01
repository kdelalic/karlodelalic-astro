import { useState, useEffect } from "react"
import { FaChevronUp } from "react-icons/fa"

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 400)
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <button
            className={`scroll-to-top ${visible ? "visible" : ""}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <FaChevronUp />
        </button>
    )
}
