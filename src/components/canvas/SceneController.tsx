"use client";

import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SceneController() {
    const { camera, scene } = useThree();

    useLayoutEffect(() => {
        // Initial Camera Position
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "main",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        // Section 2: The Conflict - Camera moves up and tilts down
        tl.to(camera.position, {
            z: 15,
            y: 5,
            duration: 2,
        }, "conflict");

        tl.to(camera.rotation, {
            x: -0.2,
            duration: 2
        }, "conflict");

        // Section 3: The System - Zoom in
        tl.to(camera.position, {
            z: 5,
            y: 0,
            duration: 2,
        }, "system");

        tl.to(camera.rotation, {
            x: 0,
            duration: 2
        }, "system");

        // Section 4: The Drop - Camera moves under, Bay opens/Drone drops
        tl.to(camera.position, {
            z: 8,
            y: -4, // Closer look
            duration: 2,
        }, "drop");

        tl.to(camera.rotation, {
            x: 0.5,
            duration: 2
        }, "drop");

        // Animate Carrier Parts
        // We can access them via scene.getObjectByName
        const drone = scene.getObjectByName("drone");
        const droneBay = scene.getObjectByName("droneBay");

        if (drone) {
            tl.to(drone.position, {
                y: -2, // Drop down
                duration: 1,
                ease: "power2.in"
            }, "drop+=0.5");
        }

        if (droneBay) {
            // Maybe open doors if we had them. For now, just a slight mechanical shift.
            tl.to(droneBay.position, {
                y: -2.2, // Bay mechanism extends
                duration: 1
            }, "drop");
        }

        return () => {
            // Cleanup
            tl.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [camera, scene]);

    return null;
}
