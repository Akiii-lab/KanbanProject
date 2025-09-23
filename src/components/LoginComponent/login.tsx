import { Input } from "../ui/input";
import "./login.css";

export const LoginComponent = () => {
    return (
        <>
            <form className="form">
                <p>Login</p>
                <div className="group">
                    <Input required className="main-input" type="text" placeholder="Email" />
                </div>
                <div className="container-1">
                    <div className="group">
                        <Input required className="main-input" type="password" placeholder="Password" />
                    </div>
                </div>
                <button className="submit">Submit</button>
            </form>
        </>
    );
};