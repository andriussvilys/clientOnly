const pullUp = (options, offsetCallback) => {
  const dragItem = document.getElementById(options.childId);

  var active = false;
  var currentX;
  var currentY = null;
  var initialX;
  var initialY;
  var xOffset = 0;
  var yOffset = 0;

  let previousY = 0
  const maxY = dragItem.clientHeight;

  dragItem.addEventListener("touchstart", dragStart, false);
  dragItem.addEventListener("touchend", dragEnd, false);
  dragItem.addEventListener("touchmove", drag, false);

  function dragStart(e) {
    e.stopPropagation()

    console.log("previousY")
    console.log(previousY)

        if (e.type === "touchstart") {
          if (e.touches.length > 1) {
            return;
          }
          initialY = e.touches[0].clientY - yOffset;
          initialX = e.touches[0].clientX - xOffset;
          if (
            dragItem.classList.contains("info-up") &&
            !dragItem.classList.contains("dragged")
          ) {
            initialY = e.touches[0].clientY;
          }
        } else {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
        }
        active = true;
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    xOffset = currentX;
    yOffset = currentY;

    previousY = currentY
    if (currentY < 0) {
      dragItem.classList.add("dragged");
    }
    active = false;
  }

  function drag(e) {
    if (active) {

      if (e.type === "touchmove") {
        dragItem.classList.remove("info-up")
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
        if (
          dragItem.classList.contains("info-up") &&
          !dragItem.classList.contains("dragged")
        ) {
          currentY = initialY - e.touches[0].clientY;
        }
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      if (-currentY > dragItem.clientHeight) {
        currentY = -dragItem.clientHeight;
        dragItem.classList.add("info-up")
      }
      if (currentY > 0) {
        currentY = 0;
      }
      if(currentY !== 0){
          setTranslate(currentX, currentY, dragItem);
      }

    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translateY(${yPos}px)`;
  }
};

export default pullUp;
