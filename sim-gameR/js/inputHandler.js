export function inputInit(camera, tracking, pos) {
    window.addEventListener("pointerdown", (event) => {
        // console.log("X: " + event.clientX);
        // console.log("Y: " + event.clientY);
        tracking = true;
        pos.x = event.clientX;
        pos.y = event.clientY;
    });
    
    window.addEventListener("pointermove", (event) => {
        if (!tracking) {
            return;
        }
    
        if (camera.position._x > 40 || camera.position._x < -40 || camera.position._z > 40 || camera.position._z < -40) {
            if (camera.position._x > 5) {
                camera.position._x--;
            }
            if (camera.position._x < -35) {
                camera.position._x++;
            }
            if (camera.position._z > 5) {
                camera.position._z--;
            }
            if (camera.position._z < -35) {
                camera.position._z++;
            }
            return;
        }
    
        let x = event.clientX;
        let y = event.clientY;
    
        const slower = .001;
    
        if (x > pos.x) {
            camera.position._x -= ((x - pos.x) - camera.position._x) * slower;
        } else if (x < pos.x) {
            camera.position._x -= ((x - pos.x) - Math.abs(camera.position._x)) * slower;
            
        }
    
        if (y > pos.y) {
            camera.position._z += ((y - pos.y) - camera.position._z) * slower;
        } else if (y < pos.y) {
            camera.position._z += ((y - pos.y) - Math.abs(camera.position._z)) * slower;
        }
        
    });
    
    window.addEventListener("pointerup", (event) => {
        tracking = false;
    })
}