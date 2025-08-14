import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuShoppingBag } from "react-icons/lu";
import "./Home.css";

function Home() {
    return (
        <div className="page home-background">
            <h1 className="content">
                Start your shopping journey with
                <Link to="/products" className="btn">
                    ShopNow <LuShoppingBag />
                </Link>
                {/* <div className="account">
                    <Link to="/login" className="btn">
                        Login
                    </Link>
                    <Link to="/signup" className="btn">
                        Create your an account
                    </Link>
                </div> */}
            </h1>

        </div>
    )
}

export default Home;