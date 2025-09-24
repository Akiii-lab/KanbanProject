
import "./loader.css";

interface LoaderProps {
    text?: string;
}

export const Loader = ({ text = "Loading" }: LoaderProps) => {
    return (
        <div className="loader-wrapper">
            {text.split("").map((char, idx) => (
                <span className="loader-letter" key={char + idx}>
                    {char === " " ? <>&nbsp;</> : char}
                </span>
            ))}
            <div className="loader"></div>
        </div>
    );
}
