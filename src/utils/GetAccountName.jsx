export function GetAccountName(account, languageId) {
    if (!account) return "";
    if (languageId == 1) return account.dname;
    return account.dnamE2 && account.dnamE2.trim() !== ""
      ? account.dnamE2
      : account.dname;
  }