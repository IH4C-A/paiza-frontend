import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./NewSchedulePage.module.css";

// デモ用：今日から30日分、全曜日・全時間帯で必ず選択肢が出るモックデータを生成
const allDays = ["日", "月", "火", "水", "木", "金", "土"];
const allTimes = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const todayDate = new Date();
function getDateString(offset: number) {
  const d = new Date(todayDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}
const demoTimeSlots = Array.from({length: 30}).map((_, i) => ({ day: getDateString(i), slots: allTimes }));
const mentors = [
  {
    id: "1",
    name: "田中 太郎",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "S",
    introduction: "10年以上のWebエンジニア経験を持ち、React/Next.jsを中心としたフロントエンド開発が得意です。初心者から上級者まで丁寧に指導します。",
    categories: ["React", "JavaScript", "TypeScript", "Next.js"],
    rating: 4.9,
    reviewCount: 156,
    menteeCount: 23,
    responseTime: "平均2時間以内",
    status: "available",
    availableDays: allDays,
    availableTimeSlots: demoTimeSlots,
    topics: [
      "Reactのパフォーマンス最適化",
      "Next.jsのSSRとSSG",
      "TypeScriptの型システム",
      "フロントエンドのテスト戦略",
      "状態管理ライブラリの選定",
      "キャリア相談"
    ]
  },
  {
    id: "2",
    name: "佐藤 花子",
    avatar: "/placeholder.svg?height=80&width=80",
    rank: "A",
    introduction: "UI/UXデザイナーとして5年の経験があります。デザインシステムの構築やユーザビリティ向上のお手伝いをします。",
    categories: ["UI/UX", "Figma", "デザインシステム", "ユーザビリティ"],
    rating: 4.8,
    reviewCount: 89,
    menteeCount: 15,
    responseTime: "平均4時間以内",
    status: "available",
    availableDays: allDays,
    availableTimeSlots: demoTimeSlots,
    topics: [
      "UIデザインのレビュー",
      "デザインシステムの構築",
      "ユーザビリティテスト",
      "プロトタイピング手法",
      "デザインポートフォリオの作成",
      "キャリア相談"
    ]
  }
];
function formatDate(dateString: string) { const date = new Date(dateString); return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date); }
function getDayOfWeek(dateString: string) { const date = new Date(dateString); const days = ["日", "月", "火", "水", "木", "金", "土"]; return days[date.getDay()]; }
const today = new Date(); const currentMonth = today.getMonth(); const currentYear = today.getFullYear();

// カレンダーの日付を生成するヘルパー関数
function generateCalendarDays(year: number, month: number) {
  const days = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push({
      date: currentDate,
      isCurrentMonth: currentDate.getMonth() === month,
    });
  }
  return days;
}

// --- メインコンポーネント ---
export default function NewSchedulePage() {
  const [searchParams] = useSearchParams();
  const preselectedMentorId = searchParams.get("mentor");

  const [step, setStep] = useState(preselectedMentorId ? 2 : 1);
  const [selectedMentorId, setSelectedMentorId] = useState(preselectedMentorId || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("60");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [description, setDescription] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [dateView, setDateView] = useState("calendar");

  const selectedMentor = mentors.find((mentor) => mentor.id === selectedMentorId);
  const changeMonth = (increment: number) => { let newMonth = calendarMonth + increment; let newYear = calendarYear; if (newMonth > 11) { newMonth = 0; newYear += 1; } else if (newMonth < 0) { newMonth = 11; newYear -= 1; } setCalendarMonth(newMonth); setCalendarYear(newYear); };
  
  const availableDates = useMemo(() => { if (!selectedMentor) return []; const dates = []; const startDate = new Date(); for (let i = 0; i < 30; i++) { const date = new Date(startDate); date.setDate(startDate.getDate() + i); const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]; if (selectedMentor.availableDays.includes(dayOfWeek)) { const dateString = date.toISOString().split("T")[0]; const hasTimeSlots = selectedMentor.availableTimeSlots.some((day) => day.day === dateString); if (hasTimeSlots) dates.push({ date: dateString, dayOfWeek }); } } return dates; }, [selectedMentor]);
  const availableTimeSlots = useMemo(() => { if (!selectedMentor || !selectedDate) return []; const daySlots = selectedMentor.availableTimeSlots.find((day) => day.day === selectedDate); return daySlots ? daySlots.slots : []; }, [selectedMentor, selectedDate]);
  
  const goToNextStep = () => setStep(step + 1);
  const goToPreviousStep = () => setStep(step - 1);
  const confirmBooking = () => { console.log({ mentorId: selectedMentorId, date: selectedDate, time: selectedTime, duration: selectedDuration, topic: selectedTopic === "custom" ? customTopic : selectedTopic, description, }); setStep(4); };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className={styles.stepTitle}>メンターを選択</h2>
            <div className={styles.formGridMd2}>
              {mentors.map((mentor) => (
                <div key={mentor.id} className={`${styles.card} ${styles.mentorCard} ${selectedMentorId === mentor.id ? styles.mentorCardSelected : ""}`} onClick={() => setSelectedMentorId(mentor.id)}>
                  <div className={styles.mentorCardContent}>
                    <div className={styles.avatar}><img src={mentor.avatar} alt={mentor.name} /></div>
                    <div className={styles.mentorDetails}>
                      <div className={styles.mentorNameContainer}><h3 className={styles.mentorName}>{mentor.name}</h3><span className={`${styles.badge} ${styles.rankBadge} ${mentor.rank === 'S' ? styles.rankBadgeS : styles.rankBadgeA}`}>{mentor.rank}</span></div>
                      <div className={styles.ratingContainer}><img src="/icons/star.svg" alt="Rating"/> <span className={styles.ratingText}>{mentor.rating}</span><span className={styles.ratingCount}>({mentor.reviewCount}件)</span></div>
                      <div className={styles.categoriesContainer}>{mentor.categories.slice(0, 3).map((cat) => <span key={cat} className={styles.categoryBadge}>{cat}</span>)}</div>
                    </div>
                    {selectedMentorId === mentor.id && <div className={styles.selectionCheck}><img src="/icons/check.svg" alt="Selected"/></div>}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.actionsContainer}><button onClick={goToNextStep} disabled={!selectedMentorId} className={`${styles.actionButton} ${styles.buttonPrimary}`}>次へ</button></div>
          </div>
        );
      case 2:
        if (!selectedMentor) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
              <p>メンター情報が見つかりません。<br/>一度「戻る」でメンターを選択してください。</p>
              <button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={goToPreviousStep}>戻る</button>
            </div>
          );
        }
        return (
          <div>
            <div className={styles.stepTitleContainer}><button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={goToPreviousStep}><img src="/icons/arrow-left.svg" alt="Back"/>戻る</button><h2 className={styles.stepTitle}>日時を選択</h2></div>
            <div className={styles.formGridMd12}>
              <div className={styles.card}><div className={styles.cardHeader}><h3 className={styles.cardTitle}>選択したメンター</h3></div><div className={styles.cardContent}><div className={styles.selectedMentorInfo}><div className={styles.avatar}><img src={selectedMentor.avatar} alt={selectedMentor.name}/></div><div><div className={styles.mentorNameContainer}><h3 className={styles.mentorName}>{selectedMentor.name}</h3><span className={`${styles.badge} ${styles.rankBadge} ${selectedMentor.rank === 'S' ? styles.rankBadgeS : styles.rankBadgeA}`}>{selectedMentor.rank}</span></div><div className={styles.ratingContainer}><img src="/icons/star.svg" alt="Rating"/> <span className={styles.ratingText}>{selectedMentor.rating}</span></div></div></div><hr className={styles.infoSeparator}/><div className={styles.infoRow}><img src="/icons/calendar.svg" alt=""/><span>利用可能日: {selectedMentor.availableDays.join(", ")}</span></div><div className={styles.infoRow}><img src="/icons/message-square.svg" alt=""/><span>返信時間: {selectedMentor.responseTime}</span></div></div></div>
              <div>
                <div className={styles.dateViewTabsList}><button onClick={() => setDateView('calendar')} className={`${styles.dateViewTab} ${dateView === 'calendar' ? styles.dateViewTabActive : ''}`}>カレンダー</button><button onClick={() => setDateView('list')} className={`${styles.dateViewTab} ${dateView === 'list' ? styles.dateViewTabActive : ''}`}>リスト</button></div>
                {dateView === 'calendar' && (<div><div className={styles.calendarNav}><h3>{new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long" }).format(new Date(calendarYear, calendarMonth))}</h3><div className={styles.calendarNavControls}><button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={() => changeMonth(-1)}><img src="/icons/chevron-left.svg" alt="前月"/></button><button className={`${styles.actionButton} ${styles.buttonOutline}`} onClick={() => { setCalendarMonth(currentMonth); setCalendarYear(currentYear); }}>今月</button><button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={() => changeMonth(1)}><img src="/icons/chevron-right.svg" alt="翌月"/></button></div></div>
                <div className={styles.calendarGrid}>
                    {["日","月","火","水","木","金","土"].map(d => <div key={d} className={styles.calendarGridHeader}>{d}</div>)}
                    {generateCalendarDays(calendarYear, calendarMonth).map((day, i) => {
                        const dateStr = day.date.toISOString().split("T")[0];
                        const isAvailable = availableDates.some(d => d.date === dateStr);
                        return <div key={i} className={`${styles.calendarDay} ${!day.isCurrentMonth ? styles.dayNotInMonth : ''} ${isAvailable && day.isCurrentMonth ? styles.dayAvailable : styles.dayDisabled} ${selectedDate === dateStr ? styles.daySelected : ''}`} onClick={() => {if (isAvailable && day.isCurrentMonth) {setSelectedDate(dateStr); setSelectedTime('')}}}>{day.date.getDate()}</div>
                    })}
                </div>
                </div>)}
                {dateView === 'list' && (<div className={styles.dateList}>{availableDates.map(date => <div key={date.date} className={`${styles.dateListItem} ${selectedDate === date.date ? styles.dateListItemSelected : ''}`} onClick={() => { setSelectedDate(date.date); setSelectedTime(''); }}><div className={styles.infoRow}><img src="/icons/calendar.svg" alt=""/><span>{formatDate(date.date)} ({date.dayOfWeek})</span></div><div className={styles.selectionCheck}><img src="/icons/check.svg" alt="Selected"/></div></div>)}</div>)}
                {selectedDate && <div style={{marginTop: '1.5rem'}}> <h3 style={{fontWeight:500, marginBottom:'0.75rem'}}>{formatDate(selectedDate)}の利用可能な時間</h3> <div className={styles.timeSlotGrid}> {availableTimeSlots.map(time => <button key={time} className={`${styles.timeSlotButton} ${selectedTime === time ? styles.timeSlotSelected : ''}`} onClick={() => setSelectedTime(time)}>{time}</button>)} {availableTimeSlots.length === 0 && <div style={{gridColumn: 'span 3'}}>利用可能な時間がありません</div>} </div> </div>}
                {selectedTime && <div style={{marginTop: '1.5rem'}}> <h3 style={{fontWeight:500, marginBottom:'0.75rem'}}>面談時間</h3> <div className={styles.radioGroupContainer}> <div className={styles.radioItem}><input type="radio" id="d-30" value="30" checked={selectedDuration === '30'} onChange={e => setSelectedDuration(e.target.value)} className={styles.radioInput}/><label htmlFor="d-30" className={styles.radioLabel}><span className={styles.radioCircle}><span className={styles.radioCircleInner}></span></span>30分</label></div> <div className={styles.radioItem}><input type="radio" id="d-60" value="60" checked={selectedDuration === '60'} onChange={e => setSelectedDuration(e.target.value)} className={styles.radioInput}/><label htmlFor="d-60" className={styles.radioLabel}><span className={styles.radioCircle}><span className={styles.radioCircleInner}></span></span>60分</label></div> </div> </div>}
              </div>
            </div>
            <div className={styles.actionsContainer}><button onClick={goToNextStep} disabled={!selectedDate || !selectedTime} className={`${styles.actionButton} ${styles.buttonPrimary}`}>次へ</button></div>
          </div>
        );
      case 3:
        if (!selectedMentor) {
          return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
              <p>メンター情報が見つかりません。<br/>一度「戻る」でメンターを選択してください。</p>
              <button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={goToPreviousStep}>戻る</button>
            </div>
          );
        }
        return (
          <div>
            <div className={styles.stepTitleContainer}><button className={`${styles.actionButton} ${styles.buttonGhost}`} onClick={goToPreviousStep}><img src="/icons/arrow-left.svg" alt="Back"/>戻る</button><h2 className={styles.stepTitle}>面談の詳細</h2></div>
            <div className={styles.formGridMd12}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className={styles.formField}><label htmlFor="topic" className={styles.formLabel}>面談トピック</label><select id="topic" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className={styles.formSelect}><option value="" disabled>トピックを選択</option>{selectedMentor.topics.map(t=><option key={t} value={t}>{t}</option>)}<option value="custom">その他（自由入力）</option></select></div>
                  {selectedTopic === 'custom' && <div className={styles.formField}><label htmlFor="custom-topic" className={styles.formLabel}>カスタムトピック</label><input id="custom-topic" placeholder="面談のトピックを入力" value={customTopic} onChange={e => setCustomTopic(e.target.value)} className={styles.formInput}/></div>}
                  <div className={styles.formField}><label htmlFor="description" className={styles.formLabel}>詳細説明</label><textarea id="description" placeholder="相談したい内容や質問を詳しく記入してください" value={description} onChange={e => setDescription(e.target.value)} className={styles.formTextarea}/></div>
                  <div className={styles.alert}><img src="/icons/info.svg" alt="Info"/><div><h4 className={styles.alertTitle}>面談の準備</h4><p className={styles.alertDescription}>面談を効果的にするため、事前に質問をまとめておくことをおすすめします。</p></div></div>
              </div>
              <div className={styles.card}><div className={styles.cardHeader}><h3 className={styles.cardTitle}>予約内容の確認</h3><p className={styles.cardDescription}>以下の内容で予約します</p></div><div className={`${styles.cardContent} ${styles.summaryCardContent}`}><div className={styles.selectedMentorInfo}><div className={styles.avatar}><img src={selectedMentor.avatar} alt={selectedMentor.name}/></div><div><div className={styles.mentorName}>{selectedMentor.name}</div><div style={{fontSize:'0.875rem', color: 'var(--muted-color)'}}>{selectedMentor.categories.slice(0,2).join(', ')}</div></div></div><hr className={styles.infoSeparator}/><div className={styles.summaryRow}><div className={styles.summaryValueContainer}><img src="/icons/calendar.svg" alt=""/><span>{selectedDate && `${formatDate(selectedDate)} (${getDayOfWeek(selectedDate)})`}</span></div><div className={styles.summaryValueContainer}><img src="/icons/clock.svg" alt=""/><span>{selectedTime} - {selectedTime && `${new Date(`2000-01-01T${selectedTime}`).getHours() + Math.floor(Number.parseInt(selectedDuration) / 60)}:${(Number.parseInt(selectedDuration) % 60).toString().padStart(2, '0')}`}</span></div><div className={styles.summaryValueContainer}><img src="/icons/message-square.svg" alt=""/><span>{selectedDuration}分間</span></div></div><hr className={styles.infoSeparator}/><div className={styles.summaryRow}><div className={styles.summaryLabel}>トピック</div><div className={styles.summaryValue}>{selectedTopic === "custom" ? customTopic : selectedTopic || "未選択"}</div></div></div></div>
            </div>
            <div className={styles.actionsContainer}><button className={`${styles.actionButton} ${styles.buttonOutline}`} onClick={goToPreviousStep}>戻る</button><button onClick={confirmBooking} disabled={!selectedTopic || (selectedTopic === 'custom' && !customTopic)} className={`${styles.actionButton} ${styles.buttonPrimary}`}>予約を確定する</button></div>
          </div>
        );
      case 4:
        return (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'green' }}>
            <p>予約が完了しました。</p>
            <button className={`${styles.actionButton} ${styles.buttonPrimary}`} onClick={() => window.location.href = "/mentor"}>メンター一覧に戻る</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {renderStepContent()}
    </div>
  );
}