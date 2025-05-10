import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const fadeIn = (element: HTMLElement, duration = 0.5) => {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration,
    ease: 'power2.out',
  });
};

export const staggerFadeIn = (elements: HTMLElement[], duration = 0.5, stagger = 0.1) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    duration,
    stagger,
    ease: 'power2.out',
  });
};

export const slideIn = (element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 0.5) => {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 },
  };

  return gsap.from(element, {
    ...directions[direction],
    opacity: 0,
    duration,
    ease: 'power2.out',
  });
};

export const floatAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    y: -10,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  });
};

export const pulseAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  });
};

export const shimmerEffect = (element: HTMLElement) => {
  return gsap.to(element, {
    backgroundPosition: '200% center',
    duration: 2,
    repeat: -1,
    ease: 'linear',
  });
};

export const bounceIn = (element: HTMLElement) => {
  return gsap.from(element, {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
  });
};

export const fadeInUp = (element: HTMLElement) => {
  return gsap.from(element, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
  });
};

export const scaleIn = (element: HTMLElement) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)',
  });
};

export const slideInFromLeft = (element: HTMLElement) => {
  return gsap.from(element, {
    x: -50,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  });
};

export const slideInFromRight = (element: HTMLElement) => {
  return gsap.from(element, {
    x: 50,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  });
};

export const fadeInWithDelay = (element: HTMLElement, delay = 0.2) => {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay,
    ease: 'power2.out',
  });
};

export const createParallaxEffect = (element: HTMLElement, speed = 0.5) => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      gsap.to(element, {
        y: self.progress * 100 * speed,
        duration: 0.5,
        ease: 'power2.out',
      });
    },
  });
};