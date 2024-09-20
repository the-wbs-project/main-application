import { Browser, BrowserInfo } from '../models';

type UserAgentRule = [Browser, RegExp];
type UserAgentMatch = [Browser, RegExpExecArray] | false;

// tslint:disable-next-line:max-line-length
const SEARCHBOX_UA_REGEX =
  /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
const REQUIRED_VERSION_PARTS = 3;

const userAgentRules: UserAgentRule[] = [
  ['aol', /AOLShield\/([0-9\._]+)/],
  ['edge', /Edge\/([0-9\._]+)/],
  ['edge-ios', /EdgiOS\/([0-9\._]+)/],
  ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
  ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
  ['samsung', /SamsungBrowser\/([0-9\.]+)/],
  ['silk', /\bSilk\/([0-9._-]+)\b/],
  ['miui', /MiuiBrowser\/([0-9\.]+)$/],
  ['beaker', /BeakerBrowser\/([0-9\.]+)/],
  ['edge-chromium', /EdgA?\/([0-9\.]+)/],
  [
    'chromium-webview',
    /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
  ],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['fxios', /FxiOS\/([0-9\.]+)/],
  ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
  ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
  [
    'pie',
    /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/,
  ],
  ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ['android', /Android\s([0-9\.]+)/],
  ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
  ['facebook', /FB[AS]V\/([0-9\.]+)/],
  ['instagram', /Instagram\s([0-9\.]+)/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
  ['curl', /^curl\/([0-9\.]+)$/],
  ['searchbot', SEARCHBOX_UA_REGEX],
];

export function detect(userAgent?: string): BrowserInfo | null {
  if (!!userAgent) {
    return parseUserAgent(userAgent);
  }

  if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }
  return null;
}

function matchUserAgent(ua: string): UserAgentMatch {
  // opted for using reduce here rather than Array#first with a regex.test call
  // this is primarily because using the reduce we only perform the regex
  // execution once rather than once for the test and for the exec again below
  // probably something that needs to be benchmarked though
  return (
    ua !== '' &&
    userAgentRules.reduce<UserAgentMatch>(
      (matched: UserAgentMatch, [browser, regex]) => {
        if (matched) {
          return matched;
        }

        const uaMatch = regex.exec(ua);
        return !!uaMatch && [browser, uaMatch];
      },
      false
    )
  );
}

export function browserName(ua: string): Browser | null {
  const data = matchUserAgent(ua);
  return data ? data[0] : null;
}

export function parseUserAgent(ua: string): BrowserInfo | null {
  const matchedRule: UserAgentMatch = matchUserAgent(ua);

  if (!matchedRule) {
    return null;
  }

  const [name, match] = matchedRule;

  // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
  let versionParts =
    match[1] && match[1].split('.').join('_').split('_').slice(0, 3);
  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = [
        ...versionParts,
        ...createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length),
      ];
    }
  } else {
    versionParts = [];
  }

  return { name, version: parseInt(versionParts[0]), isMobile: isMobile() };
}

function createVersionParts(count: number): string[] {
  const output = [];
  for (let ii = 0; ii < count; ii++) {
    output.push('0');
  }

  return output;
}

function isMobile() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
    //@ts-ignore
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
