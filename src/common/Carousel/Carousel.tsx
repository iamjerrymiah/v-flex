import { forwardRef, useEffect } from 'react'
import ReactCarousel from 'react-multi-carousel';
import './style.css'

const responsive = {
    xlDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 576 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 576, min: 0 },
        items: 1
    }
};


const Carousel = forwardRef(({ children, goTo, autoPlay, infinite, arrowOnHover, ...props }:any, ref:any) => {
    useEffect(() => {
        ref?.current && ref?.current.goToSlide(goTo)
    }, [ref, goTo])
    
    return (
        <ReactCarousel
            responsive={responsive}
            swipeable={true}
            draggable={false}
            showDots={true}
            infinite={infinite}
            focusOnSelect={true}
            centerMode={false}
            // deviceType={this.props.deviceType}
            // autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlay={autoPlay}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            transitionDuration={200}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-10-px"
            className={arrowOnHover ? 'arrow-on-hover' : ''}
            ref={ref}
            children={children}
            {...props}
        />
    )
})

export default Carousel