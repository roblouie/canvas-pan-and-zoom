// See blogpost here for more details: https://roblouie.com/article/617

window.onload = () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // See individual pixels when zooming
    context.imageSmoothingEnabled = false;


    // Simply used to display the mouse position and transformed mouse position
    const mousePos = document.getElementById('mouse-pos');
    const transformedMousePos = document.getElementById('transformed-mouse-pos');

    const image = new Image();
    image.src = "https://roblouie.com/wp-content/uploads/2020/04/60788338_304920937106527_8424495022080625603_n.jpg";
    image.onload = drawImageToCanvas;

    let isDragging = false;
    let dragStartPosition = { x: 0, y: 0 };
    let currentTransformedCursor;

    function drawImageToCanvas() {
        context.save();
        context.setTransform(1,0,0,1,0,0);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.restore();

        context.drawImage(image, 0, 0, 200, 200);
    }

    function getTransformedPoint(x, y) {
      const originalPoint = new DOMPoint(x, y);
      return context.getTransform().invertSelf().transformPoint(originalPoint);
    }

    function onMouseDown(event) {
        isDragging = true;
        dragStartPosition = getTransformedPoint(event.offsetX, event.offsetY);
    }

    function onMouseMove(event) {
        currentTransformedCursor = getTransformedPoint(event.offsetX, event.offsetY);
        mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`;
        transformedMousePos.innerText = `Transformed X: ${currentTransformedCursor.x}, Y: ${currentTransformedCursor.y}`;
        
        if (isDragging) {
            context.translate(currentTransformedCursor.x - dragStartPosition.x, currentTransformedCursor.y - dragStartPosition.y);
            drawImageToCanvas();
        }
    }

    function onMouseUp() {
        isDragging = false;
    }

    function onWheel(event) {
        const zoom = event.deltaY < 0 ? 1.1 : 0.9;
    
        context.translate(currentTransformedCursor.x, currentTransformedCursor.y);
        context.scale(zoom, zoom);
        context.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
            
        drawImageToCanvas();
        event.preventDefault();
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);
}
