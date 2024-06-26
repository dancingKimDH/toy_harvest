import { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

export default function Ads() {

    const [activeImage, setActiveImage] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextImage = activeImage % 3 + 1;
            setActiveImage(nextImage);
        }, 5000);
        return () => {
            clearInterval(interval);
        }
    }, [activeImage])

    return (

        <div className="onepage_container flex items-center">
            <div className="carousel">
                <ul className="carousel__slides">
                    <input type="radio" name="radio-buttons" id="img-1" checked={activeImage === 1} readOnly />
                    <li className="carousel__slides-container" >
                        <div className="carousel__slides-container-img">
                            <img src="/images/4.jpg" alt="image 1" />
                        </div>
                        <div className="carousel__slides-container-controls">
                            <label htmlFor="" onClick={() => setActiveImage(3)} className="carousel__slides-container-controls-prev"><span><GrFormPrevious /></span></label>
                            <label htmlFor="" onClick={() => setActiveImage(2)} className="carousel__slides-container-controls-next"><span><GrFormNext /></span></label>
                        </div>
                    </li>
                    <input type="radio" name="radio-buttons" id="img-2" checked={activeImage === 2} readOnly />
                    <li className="carousel__slides-container" >
                        <div className="carousel__slides-container-img">
                            <img src="/images/3.jpg" alt="image 2" />
                        </div>
                    </li>
                    <input type="radio" name="radio-buttons" id="img-3" checked={activeImage === 3} readOnly />
                    <li className="carousel__slides-container" >
                        <div className="carousel__slides-container-img">
                            <img src="/images/1.jpg" alt="image 3" />
                        </div>
                    </li>

                    <div className="carousel__slides-dots">
                        <label onClick={() => setActiveImage(1)} className="carousel__slides-dots-dot" id="img-dot-1"></label>
                        <label onClick={() => setActiveImage(2)} className="carousel__slides-dots-dot" id="img-dot-2"></label>
                        <label onClick={() => setActiveImage(3)} className="carousel__slides-dots-dot" id="img-dot-3"></label>
                    </div>

                </ul>
            </div>
        </div>

    )

}