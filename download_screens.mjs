import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const screens = [
  {
    order: 1,
    id: "9809d42a27f349e99e4e91b4347b6310",
    title: "finesseodds_logo",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1V__Y0OJQct6qnA6aLHdmG9HNVfPfLd_ATy-uzYwhSqNZrZ8obl9_rNzP6ZJZuSizYjNOTP8L02tzDvxMjyesBDHc8DxQ7SYbfwgNKuJ5gmxhY-mk4ht45t1RkYT2_mjmmUZyykpxd_8eyKLZmpcH6nroY4qeTyKDol_xAivyAAYxP7DChVQ3MI7vgG2_zgle0Gkw62nPWYnxYVrullYqq4jeu77K5BrSQAeePXJoBRJxK3TiisRgCeelkp",
    htmlUrl: null
  },
  {
    order: 2,
    id: "2400a20edcce480caa09098d807e7423",
    title: "match_radar_live_dashboard",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1V6AVmuyzSb3S942j3lWzftnHGbC8Ue2bVlLpqqtgoEIZy80jbPwKcR9PAQEwqBcZikXu5VtNCP2yQA4fq38TjY6CSDn_ke-S1L3DHn1s4lE9Z-ectjDxMw20c0vma_bG9mvKtTRdGkrr2nv5MKfl2EgDD88KWVFjB3JVsTOBtdS5fujX0MHVz972-FkQDPbd4M5SMIjIP2MhIOuYqeRbHkq5GxPDsJhA5GJSeB_6IGikiCNcw45_syeb2_",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MDViMmVmMWIwNDRmN2Y3ZGI1MGQ3NzVkEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 3,
    id: "5660de40370049eab576b4ce863f1c4a",
    title: "converter_walkthrough_welcome",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UE2MaTP4YzYzEKRLV2Hn2GIxct-KWqp8wqCcXgeDQCK2bbmp5WEjagJD1LqksmXcPi3w1RJ9AzZMs4-UmNt9zRktas4LJUVHHXOAgmKZKd7hikcETvPm-Ti9m1KLjpSSzUg2XMi0B-lCs8uFLIfHNIybLw9W_qn6iK8Lar7rvV_yWZiyMSC6BKyzcR8kL3DUVHiDq4QDqq4pFQaaQpUnx6PHgP49Dsjq-CAhVCvzy9p-1o96q54eYb5XUO",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MjM3NmE0ZGYwNWYxMTZkNjEyMGYyOGI1EgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 4,
    id: "931963bf20174464a2d145ab8aef1f70",
    title: "onboarding_sign_up",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UACOP3tMIKhhIgwxCTBNtOqtsNpkvKM3n4srs4UUWKbbDsa37kTkFcs4RVSFaRHxw3SaHAjw7ElGokgQOyfQM4q_Evi8tYgVPD9cg8ooyFOw8cyQKhsp9Yljzr4hjSqJ0diFOFtnPILD8-bSdz9cTyX2fWc2XRkHrjVngdFzVHoeIUK51iYG-ULctKKq1T9hUIKmWDEmgmmR7sP6Bl9VMD1Doqqu21ZN6JyUIQ0CvfpUXxnOL9g7SXOXw",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MTI2MzZiNDEwNWYxM2Q3NGQ4MjcyNjNmEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 5,
    id: "99b2acf3921e484ab07274bed4de4501",
    title: "booking_code_converter",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XPEwlWe8tSZmk5I37wOwCakzayl6k50-unxLylICE_r46PsCsM0ZqRmDMxEoqT9wSCjkKgACzbIgvw-scl180KrKsnLTeX_8uMdzztpmt-W68GaiJJ8Dxxy7eQO6jNkiqmP1yyT2Ry1bF17cSVOHbucvX1A65kQiRqYEBjwBE7evedw92ZHqQfIafjv__Ayozxlp0ZFKqY1ZzzEu_csUhKuK10LtjK1qy0JXr021k_-A8OJwXABxqvF2w",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MDQwNjc3ZjYwNWYxMTZkNjEyMGYyOGI1EgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 6,
    id: "a94c9696dd9345be9b0e03f8ffe72c6d",
    title: "ai_predictions_value_bets",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1VZILe-oyfRQKq62Cp0oHj3_IUoQJtNZeLSiafztcQY8FOlS4I9u7_Jc4pDi8SJan2WskgkZQRCBX2oxWjhi_MKWgDquDpqrXnBcR5V-zkGhksHxHZ1gSutVC-F-yid3IzuZ-mRUo_FgB8iJLw0lQsKKkEq8xo3wCU2vkvUtnXNsapx_MctaEAW9j-zEK6WPFHn6lErm7nL9IqasTVUAi3s4i5Eu4n1gECi5LPX_UPDHUOt7umFyP9b26lK",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MDQ0ZWIyNzUwNDRmNTdhMjU2MmQyNGRjEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 7,
    id: "7d2c0112f99f4692a4eec871055c3a38",
    title: "vip_pro_membership",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UCFFbA1S92CTAFBcdsvBNbseeVJ_ww2o9hxvNvhaIB_0Gx_LsTM4bN8OGfmtX_kz01s6H_2nZWSGbHtUAnkZY9d27PKSdhAIQ_b-04tGxc4AqVRKw5qkfaF833qUbr6K6G_3OZjRoGswH56oe-aeAHwwp3OghXtjcNrwVC7ZRVxHTv7vP7s6WTUtfYyr5Gtco8pLVByAtNTiBWAvhEezy5gxt2lQsbfM-IC6cvu7ez3GkHB5rt77GvN4Ax",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MDRmMGJkZjMwMjNiZjg1MTI4MWNkNDUwEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 8,
    id: "2c53b71f45d6446babcaecbab48db284",
    title: "match_prediction_arsenal_chelsea",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1XrgTFeSvNEIiZRhnmqURGY3w60lJAuEVrD0QU6spx9Q0Mzel-9HeC32GlJTp60sZAgtSfMrekRfu9XgTBGp4lpNAQFCVdbkpV9tbb-KimErCfOOGFfPzHqHP-hdtYrWFa2M-uzzBEeVLZkFBcm3jgLmplIVB70jYg0BrCnboE5oKCRl1GFCEQ0QwE2jVjwXmjeSa4PJB2947eaL-I9Q8god9_T5hjgou-mcytoGYsehDMG69b4kK8zFE3O",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1M2U0YjVmMDcwNDRmNTdhMjU2MmQyNGRjEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  },
  {
    order: 9,
    id: "954f7dfcae5745b8a6f80e72e5113d86",
    title: "push_notification_permission_modal",
    screenshotUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Xh1EkoPXPDX2gMFigPjRw7mfC4K6b5Ic7bzjrjrdZydsjXu2JbOdQ17Uiy4O6PF84aP_6_YQ4LME7D0PBqPLSjGnkicoIU-L11LKlntFKv5nonVne8RO2SiBeB6RFgMmdFK44cIpXyTYQLSRKki9S43za0UE5vhH7e-8hNIGhSZ4a9MopfSjk40Vwe-Sf1r69lhUQ7RR0BCnOO2s5-iGC93rLiuuftUphljjjsl9IWJTDFqPvwGSHUeFRs",
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZDc1MjhmODJlNWIwNDRmN2Y3ZGI1MGQ3NzVkEgsSBxCR45fQ6A4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDk3MjQwNjU1Njc3Nzk1NDk4NA&filename=&opi=89354086"
  }
];

const targetBase = path.resolve('./stitch_assets');
if (!fs.existsSync(targetBase)) {
  fs.mkdirSync(targetBase, { recursive: true });
}

async function download() {
  for (const s of screens) {
    const dir = path.join(targetBase, `${s.order}_${s.title}_${s.id}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    console.log(`Processing: ${s.order}. ${s.title}`);
    if (s.screenshotUrl) {
      const imgPath = path.join(dir, 'screenshot.png');
      try {
        execSync(`curl -sSL "${s.screenshotUrl}" -o "${imgPath}"`);
        console.log(`  Saved screenshot: ${imgPath}`);
      } catch (err) {
        console.error(`  Error downloading screenshot for ${s.title}:`, err.message);
      }
    }

    if (s.htmlUrl) {
      const htmlPath = path.join(dir, 'screen.html');
      try {
        execSync(`curl -sSL "${s.htmlUrl}" -o "${htmlPath}"`);
        console.log(`  Saved html: ${htmlPath}`);
      } catch (err) {
        console.error(`  Error downloading html for ${s.title}:`, err.message);
      }
    }
  }
  console.log("Download finished!");
}

download();
