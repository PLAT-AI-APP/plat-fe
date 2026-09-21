import type ko from "./ko";

const vi: typeof ko = {
  modalUi: {
    common: {
      close: "Đóng",
      save: "Lưu",
      add: "Thêm",
      loading: "Đang tải..",
      loadingMore: "Đang tải danh sách..",
      follow: "Theo dõi",
      following: "Đang theo dõi",
      defaultBadge: "Mặc định",
    },
    addLanguage: {
      title: "Thêm ngôn ngữ",
      confirm: "Thêm",
    },
    personaAdd: {
      titleAdd: "Thêm Persona",
      titleEdit: "Chỉnh sửa Persona",
      description:
        "Bạn có thể trò chuyện với nhân vật theo vai trò được đặt trong Persona.",
      nameLabel: "Tên",
      namePlaceholder: "Vui lòng nhập tên",
      infoLabel: "Thông tin",
      infoPlaceholder:
        "Hãy nhập tuổi, tính cách và các thông tin khác một cách tự do.\n...",
      submitAdd: "Thêm",
      submitEdit: "Lưu",
    },
    profileEdit: {
      title: "Chỉnh sửa hồ sơ",
      changePassword: "Đổi mật khẩu",
      submit: "Lưu",
      invalidType: "Chỉ hỗ trợ file ảnh jpg, png, webp.",
      invalidSize: "Dung lượng file tối đa 5MB.",
    },
    userNote: {
      title: "Ghi chú người dùng",
      description:
        "Nội dung trò chuyện được tóm tắt tự động để nhân vật ghi nhớ lâu hơn.",
      placeholder:
        "Những nội dung quan trọng không được quên, các thiết lập muốn thêm\n...",
      submit: "Lưu",
      successToast: "Đã lưu ghi chú người dùng",
    },
    commentReport: {
      title: "Bình luận của {nickname} có vấn đề gì?",
      placeholder: "Vui lòng nêu rõ lý do, chúng tôi sẽ xem xét và xử lý.",
      submit: "Báo cáo",
      successToast: "Đã gửi báo cáo của bạn",
    },
    passwordReset: {
      title: "Đặt lại mật khẩu",
      description: "Bạn có thể đặt lại mật khẩu thông qua xác thực email.",
      next: "Tiếp theo",
      submit: "Đổi mật khẩu",
      successToast: "Mật khẩu của bạn đã được thay đổi.",
    },
    imageCrop: {
      title: "Chỉnh sửa ảnh",
      description:
        "Hãy căn vùng sẽ hiển thị trên ảnh đại diện theo khung vuông.",
      dragGuide: "Bạn chỉ có thể kéo ảnh để điều chỉnh vị trí.",
      zoom: "Thu phóng",
      cancel: "Hủy",
      apply: "Cắt",
      ratios: {
        original: "Tỷ lệ gốc",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "Persona",
      description:
        "Bạn có thể trò chuyện với nhân vật theo vai trò được đặt trong Persona.",
      helper: "Bạn có thể tạo tối đa 5 Persona.",
      add: "Thêm Persona",
      emptyTitle: "Chưa có Persona",
      emptyDescription: "Thêm Persona mới và thiết lập vai trò.",
      menuAria: "Mở menu Persona của {name}",
    },
    follow: {
      followers: "Người theo dõi",
      following: "Đang theo dõi",
      fallbackNickname: "Người dùng",
      ownFollowersLine1: "Để nhận được nhiều lượt theo dõi hơn,",
      ownFollowersHighlight: "hãy tạo một nhân vật thật cuốn hút",
      ownFollowersSuffix: ".",
      ownFollowersAction: "Tạo nhân vật",
      ownFollowingLine1: "Hãy tìm những creator/nhân vật bạn thích",
      ownFollowingHighlight: "và theo dõi",
      ownFollowingSuffix: " họ nhé.",
      ownFollowingAction: "Khám phá nhân vật",
      otherFollowersLine1: "{nickname} vẫn chưa có",
      otherFollowersLine2: "người theo dõi nào",
      otherFollowingLine1: "{nickname} vẫn chưa",
      otherFollowingLine2: "theo dõi ai cả",
      otherTitle: "Bạn muốn theo dõi trước không?",
      otherAction: "Theo dõi",
      profileImageAlt: "Ảnh hồ sơ của {nickname}",
    },
  },
};

export default vi;
