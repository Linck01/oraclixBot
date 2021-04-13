
/*exports.activeStatCommandCooldown = (cd,toWait) => {
  return 'You can use stat commands only once per ' + cd + ' seconds, please wait ' + Math.ceil(toWait) + ' more seconds. ';
}
exports.activeResetServerCommandCooldown = (cd,toWait) => {
  return 'You can start a server reset only once every ' + cd  + ' seconds, please wait ' + Math.ceil(toWait) + ' more seconds.';
}
exports.premiumLowersCooldown = 'You can significantly lower this cooldown by using tokens to activate premium time for your server. You can find further info about it here: https://activityrank.me/premium. ';
*/

const messages = {
  noSubcommand : 'Please specify the subcommand. Type ``<prefix>help`` for more information.',
  invalidSubcommand : 'Invalid subcommand. Type ``<prefix>help`` for more information.',
  tooFewArguments : 'Too few arguments. Type ``<prefix>help`` for more information.',
  invalidArgument : 'Invalid argument. Type ``<prefix>help`` for more information.',
  invalidId : 'Invalid id. Type ``<prefix>help`` for more information.',
  memberNotFound : 'Member not found.',
  userNotFound : 'User not found.',
  default : 'Something went wrong.',
  authorizationFailed: 'Authorization failed.',
  userDoesNotExist: 'User does not exist.',
  notEnoughCredits: 'Not enough favors left. Use the ``<prefix>!`` command to gain more favors by answering the Oracles questions.',
  userBanned: 'You are still banned and need to wait until you can use this bot again.',
  questionOrAnswerDoesNotExist: 'Could not find question/answer with given id.',
  cantSelfReport: 'You cannot report yourself.',
  reportAlreadyInDB: 'Report was already registered.',
  tipAmountWrong: 'You can only tip from 0.2 to 10 favors. Type ``<prefix>help`` for more information.',
  argumentNotDigit: 'The argument has to be a digit.',
  answerNotFound: 'Could not find answer.',
  invalidReportReason: 'Report reason has to be either "atos" (against terms of service) or "unrelated" (if the answer has nothing to do with the question).'
}

exports.get = (tag) => {
  if (messages[tag])
    return messages[tag];
  else
    return messages['default'];
}
