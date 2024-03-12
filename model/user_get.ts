export interface UserGet {
    username: string;
    image_avatar: string;
    password:    string;
    type:        string;
}
export interface ImageGet {
    id_image: number;
    username: string;
    url_image: string;
    name_image: string;
    score_image:    number;
    date:        Date;
}