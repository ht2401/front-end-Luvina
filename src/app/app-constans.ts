import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppConstants {
  public static BASE_URL_API = 'http://localhost:8085';
  public static OTHER_ERROR_MESSAGE = '従業員を取得できません'
  public static SYSTEM_ERROR_MESSAGE = 'システムエラーが発生しました。'
  public static MSG001 = 'ユーザの登録が完了しました。'
  public static MSG002 = 'ユーザの更新が完了しました。'
  public static MSG003 = 'ユーザの削除が完了しました。'
  public static MSG004 = '削除しますが、よろしいでしょうか。'
  public static MSG005 = '検索条件に該当するユーザが見つかりません。'
  public static LOGIN_ID_ISEXIST = 'アカウント名は既に存在しています。'
  // Biên tập user không tồn tại
  public static ER013 = '該当するユーザは存在していません。'
  // Xóa user không tồn tại
  public static ER014 = '該当するユーザは存在していません。'
  // Lỗi khi thao tác với database
  public static ER015 = 'システムエラーが発生しました。'
  // Kiểm tra user admin
  public static ER020 = '管理者ユーザを削除することはできません。'

  public static CODE_200 = 200
  public static CODE_400 = 400
  public static CODE_401 = 401
  public static CODE_403 = 403
  public static CODE_500 = 500
  public static CODE_600 = 600

    ER001(controlName: string): string {
      return controlName + 'を入力してください'
    }

    ER002(controlName: string): string {
      return controlName + 'を入力してください'
    }

    ER005(controlName: string, format: string): string {
      return controlName + `を${format}形式で入力してください`
    }

    ER006(controlName: string, maxLength: string): string {
      return maxLength + '桁以内の' + controlName + 'を入力してください'
    }

    ER007(controlName: string): string {
      return controlName + 'を8＜＝桁数、＜＝50桁で入力してください'
    }

    ER008(controlName: string): string {
      return controlName + 'に半角英数を入力してください'
    }

    ER009(controlName: string): string {
      return controlName + 'をカタカナで入力してください'
    }

 
    ER011(controlName: string): string {
      return controlName + 'は無効になっています。'
    }

    ER012(endDate: string, startDate: string): string {
      return `${endDate}は${startDate}より未来の日で入力してください。`
    }

    ER017(controlName: string): string {
      return controlName + 'が不正です。'
    }

    ER018(controlName: string): string {
      return controlName + 'は半角で入力してください。'
    }

    ER019(controlName: string): string {
      return controlName + 'は(a-z, A-Z, 0-9 と _)の桁のみです。最初の桁は数字ではない。'
    }
}
