// src/data/roomImages.ts

// Kiểm tra chính xác đuôi file trong thư mục của bạn là .jpg hay .png nhé!
export const ROOM_ASSET_IMAGES: Record<string, any> = {
  '1': require('../../assets/rooms/room1.png'),
  '2': require('../../assets/rooms/room2.png'),
  '3': require('../../assets/rooms/room3.png'),
  '4': require('../../assets/rooms/room4.png'),
};

export const DEFAULT_ROOM_IMAGE = ROOM_ASSET_IMAGES['1'];

export function getRoomImageSource(roomId: string, imageUrl?: string) {
  // 1. Nếu có ID trong danh sách từ 1 -> 4
  if (ROOM_ASSET_IMAGES[roomId]) {
    return ROOM_ASSET_IMAGES[roomId];
  }

  // 2. Nếu ID > 4 (ví dụ phòng 5, 6), xoay vòng dùng lại 4 ảnh trên
  const numId = parseInt(roomId, 10);
  if (!isNaN(numId)) {
    const cycleIndex = (((numId - 1) % 4) + 1).toString();
    if (ROOM_ASSET_IMAGES[cycleIndex]) {
      return ROOM_ASSET_IMAGES[cycleIndex];
    }
  }

  // 3. Nếu là link online thì ưu tiên uri
  if (imageUrl && imageUrl.startsWith('http')) {
    return { uri: imageUrl };
  }

  return DEFAULT_ROOM_IMAGE;
}