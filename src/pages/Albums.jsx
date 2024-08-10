import React from "react";
import MusicCard from "../components/MusicCard";

export default function Albums() {
    return (
        <div className="box content has-text-centered is-medium my-6">
            <h2 className="title">Top Forry...</h2>
            <p>
                Listado de canciones, si logeaste correctamente,
                <h2>Desbloqueaste el listado xD</h2>
            </p>
            
            <div className="container">
            <MusicCard
                title="Matt Cardle"
                text="For You"
                imageUrl="https://ja-mood.demo.joomlart.com/images/joomlart/videos/video-31.jpg"
                videoUrl="https://www.youtube.com/watch?v=7rONIiOrAj8"
            />
            </div>
        </div>
    );
}