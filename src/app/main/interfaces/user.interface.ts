export class User {
  public user_id: number;
  public user_name: string;
  public email_address: string;
  public first_name: string;
  public last_name: string;
  public phonenumber: string;
  public follower_count: number;
  public following_count: number;
  public created_at: string;
  public user_image: string;

  constructor(user_id: number, user_name: string, email_address: string, first_name: string, last_name: string, phonenumber: string, follower_count: number, following_count: number, created_at: string, user_image: string) {
      this.user_id = user_id;
      this.user_name = user_name;
      this.email_address = email_address;
      this.first_name = first_name;
      this.last_name = last_name;
      this.phonenumber = phonenumber;
      this.follower_count = follower_count;
      this.following_count = following_count;
      this.created_at = created_at;
      this.user_image = user_image;
  }
}