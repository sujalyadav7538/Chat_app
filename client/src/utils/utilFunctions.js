/* eslint-disable no-unused-vars */
import  animationData  from '../assets/lottie-json.json';
export const getColors = (index) => {
    const colors = ["bg-blue-400", "bg-yellow-400", "bg-pink-400", "bg-red-400"]; // include 'bg-' in the colors
    return colors[index];
  };

export  const colors = [
    "outline-blue-400",
    "outline-yellow-400",
    "outline-pink-400",
    "outline-red-400",
  ];

export const animationDefaultOptions={
    loop:true,
    autoplay:true,
    animationData
  }