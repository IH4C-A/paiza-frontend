export type logs_data = {
  log_id: string;
  log_message: string;
  created_at: string;
}

export type MileStone = {
  milestone_id: string;
  milestone: number;
  level: number;
  achieved_at: string;
  logs: logs_data[];
}

export type Plant = {
    plant_id: string;
    user_id: string;
    growth_stage: string;
    mood: string;
    plant_name: string;
    color: string;
    size: number;
    motivation_style: string;
    last_updated: Date;
    growth_milestones: MileStone;
}

export const plantTypes = [
    {
      id: "sprout",
      name: "新芽",
      description: "小さくて可愛い新芽。成長が早く、励ましが得意です。",
      icon: "🌱",
    },
    {
      id: "flower",
      name: "花",
      description: "美しい花を咲かせます。創造性を刺激してくれます。",
      icon: "🌸",
    },
    {
      id: "tree",
      name: "木",
      description: "しっかりとした木。安定感があり、長期的な目標達成をサポートします。",
      icon: "🌳",
    },
    {
      id: "cactus",
      name: "サボテン",
      description: "たくましいサボテン。困難に立ち向かう力を与えてくれます。",
      icon: "🌵",
    },
  ]

export const personalities = [
    {
      id: "cheerful",
      name: "明るい励まし屋",
      description: "いつも前向きで、あなたを元気づけてくれます。",
      traits: ["励まし上手", "ポジティブ", "エネルギッシュ"],
    },
    {
      id: "calm",
      name: "冷静なアドバイザー",
      description: "落ち着いていて、的確なアドバイスをくれます。",
      traits: ["論理的", "冷静", "分析力"],
    },
    {
      id: "gentle",
      name: "優しい癒し系",
      description: "温かく見守り、疲れた時に癒してくれます。",
      traits: ["優しい", "共感力", "癒し"],
    },
    {
      id: "strict",
      name: "厳しいコーチ",
      description: "時には厳しく、あなたの成長を促してくれます。",
      traits: ["規律正しい", "目標志向", "成長重視"],
    },
  ]