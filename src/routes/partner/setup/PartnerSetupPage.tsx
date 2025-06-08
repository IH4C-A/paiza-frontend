"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // useNavigateをインポート
import { FaArrowRight, FaHeart, FaMagic } from "react-icons/fa"

import styles from "./PartnerSetupPage.module.css"
import { useRegisterPlant } from "../../../hooks/usePlant" // useRegisterPlantフックをインポート
import { plantTypes, personalities } from "../../../types/plantType";

export default function UchinoKoSetupPage() {
  const [step, setStep] = useState(1)
  const [plantName, setPlantName] = useState("")
  const [plantType, setPlantType] = useState("")
  const [personality, setPersonality] = useState("")
  const [color, setColor] = useState("#22c55e")
  const [size, setSize] = useState(50)
  const [motivation, setMotivation] = useState("")

  // useRegisterPlantフックを使用
  const { loading, error, registerPlant } = useRegisterPlant();
  const navigate = useNavigate(); // 遷移のためにuseNavigateを初期化


  const motivationTypes = [
    {
      id: "achievement",
      name: "達成感重視",
      description: "目標達成や課題クリアを重視したサポート",
    },
    {
      id: "learning",
      name: "学習プロセス重視",
      description: "学習過程や理解度を重視したサポート",
    },
    {
      id: "social",
      name: "コミュニティ重視",
      description: "他の学習者との交流を重視したサポート",
    },
    {
      id: "balance",
      name: "バランス重視",
      description: "学習と休息のバランスを重視したサポート",
    },
  ]

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return plantName.trim() !== ""
      case 2:
        return plantType !== ""
      case 3:
        return personality !== ""
      case 4:
        return true // カスタマイズは任意
      case 5:
        return motivation !== ""
      default:
        return false
    }
  }

  // 登録処理ハンドラ
  const handleRegisterPlant = async () => {
    if (!canProceed()) return; // 最終ステップの条件を満たしていない場合は何もしない

    const plantData = {
      growth_stage: plantType, // plantTypeをgrowth_stageにマッピング
      mood: personality,       // personalityをmoodにマッピング
      plant_name: plantName,
      color: color,
      size: size,
      motivation_style: motivation,
    };

    await registerPlant(plantData);

    // 登録成功時に次のページへ遷移
    if (!error) {
      navigate("/partner");
    }
  };


  const getPlantPreview = () => {
    const selectedType = plantTypes.find((type) => type.id === plantType)
    return (
      <div className={styles.plantPreviewContainer}>
        <div
          className={styles.plantPreviewOuter}
          style={{
            width: `${size + 50}px`,
            height: `${size + 50}px`,
            backgroundColor: `${color}20`,
          }}
        >
          <div
            className={styles.plantPreviewInner}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
            }}
          >
            {selectedType?.icon || "🌱"}
          </div>
        </div>
        <h3 className={styles.plantName}>{plantName || "名前未設定"}</h3>
        <p className={styles.plantPersonality}>
          {personalities.find((p) => p.id === personality)?.name || "性格未設定"}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.pageContainer}>
          <div className={styles.centeredContent}>
            <div className={styles.pageTitleGroup}>
              <FaHeart className={styles.heartIcon} />
              <h1 className={styles.pageTitle}>うちのコを作ろう！</h1>
              <FaMagic className={styles.sparklesIcon} />
            </div>
            <p className={styles.pageDescription}>
              あなたの学習パートナーとなる「うちのコ」を作成しましょう。一緒に成長していく特別な存在です。
            </p>
          </div>

          {/* プログレスバー */}
          <div className={styles.progressBarSection}>
            <div className={styles.progressBarHeader}>
              <span className={styles.progressBarStepText}>ステップ {step} / 5</span>
              <span className={styles.progressBarCompletionText}>{Math.round((step / 5) * 100)}% 完了</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div>
              {/* ステップ1: 名前設定 */}
              {step === 1 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <span className={styles.stepNumber}>1</span>
                      うちのコの名前を決めよう
                    </h2>
                    <p className={styles.cardDescription}>あなたのパートナーにぴったりの名前を付けてください</p>
                  </div>
                  <div className={styles.cardContentSpaceY}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="plantName" className={styles.label}>名前</label>
                      <input
                        id="plantName"
                        type="text"
                        placeholder="例: モリモリ、ピカピカ、すくすく"
                        value={plantName}
                        onChange={(e) => setPlantName(e.target.value)}
                        maxLength={10}
                        className={styles.input}
                      />
                      <p className={styles.mutedText}>10文字以内で入力してください</p>
                    </div>
                    <div className={styles.hintBox}>
                      <h4 className={styles.hintTitle}>💡 名前のヒント</h4>
                      <ul className={styles.hintList}>
                        <li>• 覚えやすくて親しみやすい名前がおすすめ</li>
                        <li>• 成長や学習に関連する言葉も素敵です</li>
                        <li>• 後から変更することもできます</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ2: 種類選択 */}
              {step === 2 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <span className={styles.stepNumber}>2</span>
                      うちのコの種類を選ぼう
                    </h2>
                    <p className={styles.cardDescription}>それぞれ異なる特徴を持っています</p>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.radioGroupSpaceY}>
                      {plantTypes.map((type) => (
                        <div key={type.id} className={styles.radioItem}>
                          <input
                            type="radio"
                            id={type.id}
                            name="plantType"
                            value={type.id}
                            checked={plantType === type.id}
                            onChange={(e) => setPlantType(e.target.value)}
                            className={styles.radioItemControl}
                          />
                          <div className={styles.radioItemContent}>
                            <label htmlFor={type.id} className={styles.radioItemLabel}>
                              <span className={styles.radioItemIcon}>{type.icon}</span>
                              <span className={styles.radioItemName}>{type.name}</span>
                            </label>
                            <p className={styles.radioItemDescription}>{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ3: 性格選択 */}
              {step === 3 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <span className={styles.stepNumber}>3</span>
                      性格を選ぼう
                    </h2>
                    <p className={styles.cardDescription}>うちのコがどんな風にサポートしてくれるかが決まります</p>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.radioGroupSpaceY}>
                      {personalities.map((p) => (
                        <div key={p.id} className={styles.radioItem}>
                          <input
                            type="radio"
                            id={p.id}
                            name="personality"
                            value={p.id}
                            checked={personality === p.id}
                            onChange={(e) => setPersonality(e.target.value)}
                            className={styles.radioItemControl}
                          />
                          <div className={styles.radioItemContent}>
                            <label htmlFor={p.id} className={styles.radioItemLabel}>
                              <div className={styles.radioItemName}>{p.name}</div>
                              <p className={styles.radioItemDescription}>{p.description}</p>
                              <div className={styles.traitsContainer}>
                                {p.traits.map((trait) => (
                                  <span
                                    key={trait}
                                    className={styles.traitBadge}
                                  >
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ4: カスタマイズ */}
              {step === 4 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <span className={styles.stepNumber}>4</span>
                      見た目をカスタマイズ
                    </h2>
                    <p className={styles.cardDescription}>色やサイズを調整して、あなただけのうちのコに</p>
                  </div>
                  <div className={styles.cardContentSpaceYLarge}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="color" className={styles.label}>色</label>
                      <div className={styles.colorPickerGroup}>
                        <input
                          type="color"
                          id="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className={styles.colorInput}
                        />
                        <div className={styles.colorPalette}>
                          {["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setColor(c)}
                              className={styles.colorSwatch}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="size" className={styles.label}>サイズ</label>
                      <input
                        type="range"
                        id="size"
                        min={30}
                        max={80}
                        step={5}
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>小さい</span>
                        <span>大きい</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ5: 学習スタイル */}
              {step === 5 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                      <span className={styles.stepNumber}>5</span>
                      学習スタイルを選ぼう
                    </h2>
                    <p className={styles.cardDescription}>うちのコがどんな風にサポートするかを決めます</p>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.radioGroupSpaceY}>
                      {motivationTypes.map((type) => (
                        <div key={type.id} className={styles.radioItem}>
                          <input
                            type="radio"
                            id={type.id}
                            name="motivation"
                            value={type.id}
                            checked={motivation === type.id}
                            onChange={(e) => setMotivation(e.target.value)}
                            className={styles.radioItemControl}
                          />
                          <div className={styles.radioItemContent}>
                            <label htmlFor={type.id} className={styles.radioItemLabel}>
                              <div className={styles.radioItemName}>{type.name}</div>
                              <p className={styles.radioItemDescription}>{type.description}</p>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 登録処理中のフィードバック */}
                    {loading && <p className={styles.infoMessage}>うちのコを登録中...</p>}
                    {error && <p className={styles.errorMessage}>エラー: {error}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* プレビュー */}
            <div>
              <div className={styles.stickyCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>プレビュー</h2>
                  <p className={styles.cardDescription}>あなたのうちのコはこんな感じになります</p>
                </div>
                <div className={styles.cardContent}>{getPlantPreview()}</div>
              </div>
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className={styles.navigationButtons}>
            <button type="button" className={styles.buttonOutline} onClick={prevStep} disabled={step === 1 || loading}>
              戻る
            </button>
            <div className={styles.buttonGroup}>
              {step < 5 ? (
                <button type="button" className={styles.buttonPrimary} onClick={nextStep} disabled={!canProceed() || loading}>
                  次へ
                  <FaArrowRight className={styles.buttonIcon} />
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.buttonPrimary}
                  onClick={handleRegisterPlant}
                  disabled={!canProceed() || loading}
                >
                  完了！うちのコと始める
                  <FaHeart className={styles.buttonIcon} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}