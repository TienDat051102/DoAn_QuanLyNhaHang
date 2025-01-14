// timeoutService.js
export const checkReservationTimeout = (reservationTime, callback) => {
    const currentTime = Date.now(); // Lấy thời gian hiện tại
    const timeRemaining = reservationTime - currentTime; // Tính toán thời gian còn lại
  
    if (timeRemaining <= 900000 && timeRemaining > 0) { // Nếu còn lại 15 phút hoặc ít hơn
      const timeout = setTimeout(() => {
        callback(); // Gọi callback để mở modal thông báo
      }, timeRemaining);
  
      return () => clearTimeout(timeout); // Dọn dẹp timer khi component unmount
    }
    return null; // Không làm gì nếu không còn thời gian
  };
  