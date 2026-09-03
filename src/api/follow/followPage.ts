interface FollowUserApiItem {
  userId: string;
  profileImageUrl: string | null;
  nickname: string;
}

/** 백엔드 PageWith<FollowResponse> 응답 구조 */
export interface FollowPageResponse {
  page: {
    number: number;
    size: number;
    numberOfElements: number;
    hasNext: boolean;
    totalElements: number;
    totalPages: number;
  };
  content: FollowUserApiItem[];
}

/** 팔로워/팔로잉 목록 응답을 프론트 표시용 구조로 변환 */
export const normalizeFollowPage = (response: FollowPageResponse) => ({
  page: response.page,
  content: response.content.map((item) => ({
    userId: item.userId,
    profileImage: item.profileImageUrl,
    nickname: item.nickname,
  })),
});
