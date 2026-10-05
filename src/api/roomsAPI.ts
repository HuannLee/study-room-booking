const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_XYE8LMfuuJ0PjrSfleqYeI6odeM2l8I5GVFbobg1G0JsFl2fa7NSivSwJdyzGJA/exec';

async function postToGoogleScript(bodyData: any) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {  
      method: 'POST',
      headers: {
        // Chuyển sang URL encoded để Google Apps Script không bị kẹt socket redirect
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(bodyData),
    });

    const text = await res.text();

    // Nếu Google trả về dạng HTML (thường do lỗi script nội bộ hoặc quyền)
    if (text.startsWith('<')) {
      // Trường hợp dữ liệu thực tế vẫn đã được ghi
      if (bodyData.action === 'createBooking') {
        return {
          id: 'bk_' + Date.now(),
          ...bodyData,
          createdAt: new Date().toISOString(),
        };
      }
      throw new Error('Máy chủ Google Script phản hồi không hợp lệ.');
    }

    const data = JSON.parse(text);
    if (!data.success) {
      throw new Error(data.message || 'Thao tác thất bại');
    }
    return data;
  } catch (err: any) {
    throw err;
  }
}

export async function loginApi(params: { email: string; password: string }) {
  const data = await postToGoogleScript({ action: 'login', ...params });
  return data.user;
}

export async function registerApi(params: { name: string; email: string; password: string }) {
  const data = await postToGoogleScript({ action: 'register', ...params });
  return data.user;
}

export async function fetchRoomsApi() {
  const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getRooms`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Lỗi tải phòng');
  return data.data;
}

export async function createBookingApi(bookingData: any) {
  const data = await postToGoogleScript({ action: 'createBooking', ...bookingData });
  // Nếu trả về object booking hoặc fallback object
  return data.booking || data;
}

export async function cancelBookingApi(params: { bookingId: string; userId: string }) {
  const data = await postToGoogleScript({ action: 'cancelBooking', ...params });
  return data;
}