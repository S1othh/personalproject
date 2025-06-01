

document.addEventListener('DOMContentLoaded', () => {
  // all draggable images
  const draggables = document.querySelectorAll('.draggable');
  // location
  const initialPositions = [];

  
  draggables.forEach(el => {
    const rect = el.getBoundingClientRect();
    const containerRect = el.parentElement.getBoundingClientRect();
    const origX = rect.left - containerRect.left;
    const origY = rect.top - containerRect.top;

    // Initial Position
    initialPositions.push({
      element: el,
      origX: origX,
      origY: origY
    });

    
    el.style.left = origX + 'px';
    el.style.top  = origY + 'px';

    
    makeDraggable(el);
  });

  
  let currentDrag = null;
  let offsetX = 0;
  let offsetY = 0;

  
  function makeDraggable(el) {
    
    el.addEventListener('mousedown', e => {
      e.preventDefault();
      currentDrag = el;
      
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      el.classList.add('dragging');
    });

    
    document.addEventListener('mousemove', e => {
      if (!currentDrag) return; 
      e.preventDefault();
      
      const parentRect = currentDrag.parentElement.getBoundingClientRect();
      let newLeft = e.clientX - parentRect.left - offsetX;
      let newTop  = e.clientY - parentRect.top - offsetY;

      const maxLeft = parentRect.width - currentDrag.offsetWidth;
      const maxTop  = parentRect.height - currentDrag.offsetHeight;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop  = Math.max(0, Math.min(newTop,  maxTop));

      currentDrag.style.left = newLeft + 'px';
      currentDrag.style.top  = newTop  + 'px';
    });

    
    document.addEventListener('mouseup', e => {
      if (!currentDrag) return;
      currentDrag.classList.remove('dragging');
      currentDrag = null;
    });
  }

  
  setTimeout(() => {
    initialPositions.forEach(item => {
      item.element.style.left = item.origX + 'px';
      item.element.style.top  = item.origY + 'px';
    });
  }, 20000);
});
