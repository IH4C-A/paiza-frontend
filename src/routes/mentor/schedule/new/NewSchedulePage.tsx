"use client";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./NewSchedulePage.module.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendar,
  FaCheck,
  FaClock,
  FaInfo,
  FaStar,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useMentorships, useMyGroupChats } from "../../../../hooks";
import { useCreateSchedule } from "../../../../hooks/useMentorSchedule";
import type { GroupChats } from "../../../../types/groupChatType";
import type { User } from "../../../../types/userTypes";

// --- Demo Data (unchanged) ---
// const allDays = ["日", "月", "火", "水", "木", "金", "土"];

const allTimes = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const topic = [
  "キャリア相談",
  "技術的な質問",
  "プロジェクトレビュー",
  "ポートフォリオレビュー",
  "面接対策",
  "業界のトレンド",
  "ネットワーキング",
];

const todayDate = new Date();
function getDateString(offset: number) {
  const d = new Date(todayDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

const demoTimeSlots = Array.from({ length: 30 }).map((_, i) => ({
  day: getDateString(i),
  slots: allTimes,
}));

// --- Date Utilities (unchanged) ---
function parseDateStringAsLocal(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateString: string) {
  const date = parseDateStringAsLocal(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getDayOfWeek(dateString: string) {
  const date = parseDateStringAsLocal(dateString);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

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

const getStartAndEndTime = (
  selectedDate: string,
  selectedTime: string,
  selectedDuration: string
): { start: string; end: string } | null => {
  if (!selectedDate || !selectedTime || !selectedDuration) return null;
  const startDate = parseDateStringAsLocal(selectedDate);
  const [hours, minutes] = selectedTime.split(":").map(Number);
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime());
  endDate.setMinutes(endDate.getMinutes() + Number.parseInt(selectedDuration));
  const startISOString = startDate.toISOString();
  const endISOString = endDate.toISOString();
  return { start: startISOString, end: endISOString };
};

// --- Main Component ---
export default function NewSchedulePage() {
  const [searchParams] = useSearchParams();

  const preselectedMentorId = searchParams.get("mentor");

  // New state to manage selection type
  const [selectionType, setSelectionType] = useState<"mentor" | "group">(
    preselectedMentorId ? "mentor" : "mentor" // Default to mentor, can be adjusted
  );

  const [step, setStep] = useState(preselectedMentorId ? 2 : 1);

  const [selectedMentorId, setSelectedMentorId] = useState(
    preselectedMentorId || ""
  );
  // New state for selected group
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("60");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [description, setDescription] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [dateView, setDateView] = useState("calendar");

  const { mentorships } = useMentorships();
  const { createSchedule } = useCreateSchedule();
  const { myGroupChats } = useMyGroupChats();

  const selectedMentor = mentorships.find(
    (mentor) => mentor.mentorship_id === selectedMentorId
  );
  // Get selected group (assuming group_id is available in demoGroups)
  const selectedGroup = myGroupChats.find(
    (group) => group.group_id === selectedGroupId
  );

  const selectedDaySlots =
    demoTimeSlots.find((t) => t.day === selectedDate)?.slots || [];

  const changeMonth = (increment: number) => {
    let newMonth = calendarMonth + increment;
    let newYear = calendarYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  const timeRange = getStartAndEndTime(
    selectedDate,
    selectedTime,
    selectedDuration
  );

  const schedule = timeRange
    ? {
        // Use selectedMentorId or selectedGroupId based on selectionType
        mentorship_id: selectedMentorId,
        group_id: selectedGroupId,
        start_time: timeRange.start,
        end_time: timeRange.end,
        topic: selectedTopic === "custom" ? customTopic : selectedTopic,
        description: description,
        status: "scheduled",
      }
    : null;

  const goToNextStep = () => setStep(step + 1);
  const goToPreviousStep = () => setStep(step - 1);

  const confirmBooking = () => {
    console.log({
      selectionType,
      selectedId:
        selectionType === "mentor" ? selectedMentorId : selectedGroupId,
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      topic: selectedTopic === "custom" ? customTopic : selectedTopic,
      description,
    });

    if (schedule) {
      createSchedule(schedule).then(() => {
        alert("予約が完了しました。");
      });
      setStep(4);
    } else {
      alert("日付・時間を正しく選択してください。");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className={styles.stepTitle}>予約する相手を選択</h2>
            {/* ★新しいタブセクションの追加★ */}
            <div className={styles.mentorTabsSection}>
              <div className={styles.mentorTabsList}>
                <button
                  className={`${styles.mentorTabTrigger} ${
                    selectionType === "mentor"
                      ? styles.mentorTabTriggerActive
                      : ""
                  }`}
                  onClick={() => setSelectionType("mentor")}
                >
                  mentor
                </button>
                <button
                  className={`${styles.mentorTabTrigger} ${
                    selectionType === "group"
                      ? styles.mentorTabTriggerActive
                      : ""
                  }`}
                  onClick={() => setSelectionType("group")}
                >
                  group
                </button>
              </div>
            </div>

            {selectionType === "mentor" && (
              <div>
                <h3 className={styles.subHeading}>メンターを選択</h3>
                <div className={styles.formGridMd2}>
                  {mentorships.map((mentor) => (
                    <div
                      key={mentor.mentorship_id}
                      className={`${styles.card} ${styles.mentorCard} ${
                        selectedMentorId === mentor.mentorship_id
                          ? styles.mentorCardSelected
                          : ""
                      }`}
                      onClick={() => setSelectedMentorId(mentor.mentorship_id)}
                    >
                      <div className={styles.mentorCardContent}>
                        <div className={styles.avatar}>
                          <img
                            src={mentor?.mentor?.profile_image ?? undefined}
                            alt={mentor.mentor.first_name}
                          />
                        </div>
                        <div className={styles.mentorDetails}>
                          <div className={styles.mentorNameContainer}>
                            <h3 className={styles.mentorName}>
                              {mentor.mentor.first_name}
                            </h3>
                            <span
                              className={`${styles.badge} ${styles.rankBadge} ${
                                mentor.mentor.ranks?.[1]?.rank_name === "S"
                                  ? styles.rankBadgeS
                                  : styles.rankBadgeA
                              }`}
                            >
                              {mentor.mentor.ranks?.[1]?.rank_name}
                            </span>
                          </div>
                          <div className={styles.ratingContainer}>
                            <FaStar style={{ color: "gold" }} />
                            <span className={styles.ratingText}></span>
                            <span className={styles.ratingCount}></span>
                          </div>
                          <div className={styles.categoriesContainer}>
                            {mentor.mentor.categories.slice(0, 3).map((cat) => (
                              <span
                                key={cat.category_id}
                                className={styles.categoryBadge}
                              >
                                {cat.category_name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {selectedMentorId === mentor.mentorship_id && (
                          <div className={styles.selectionCheck}>
                            <FaCheck />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectionType === "group" && (
              <div>
                <h3 className={styles.subHeading}>グループを選択</h3>
                <div className={styles.formGridMd2}>
                  {myGroupChats.map((group) => (
                    <div
                      key={group.group_id}
                      className={`${styles.card} ${styles.mentorCard} ${
                        selectedGroupId === group.group_id
                          ? styles.mentorCardSelected
                          : ""
                      }`}
                      onClick={() => setSelectedGroupId(group.group_id)}
                    >
                      <div className={styles.mentorCardContent}>
                        <div className={styles.avatar}>
                          <img
                            src={group.group_image ?? "/placeholder.png"}
                            alt={group.group_name}
                          />
                        </div>
                        <div className={styles.mentorDetails}>
                          <div className={styles.mentorNameContainer}>
                            <h3 className={styles.mentorName}>
                              {group.group_name}
                            </h3>
                          </div>
                          <p className={styles.mutedText}>
                            {group.description}
                          </p>
                          <div className={styles.categoriesContainer}>
                            <span className={styles.categoryBadge}>
                              {group.category?.category_name}
                            </span>
                            <span className={styles.categoryBadge}>
                              メンバー: {group.member_count}
                            </span>
                          </div>
                        </div>
                        {selectedGroupId === group.group_id && (
                          <div className={styles.selectionCheck}>
                            <FaCheck />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actionsContainer}>
              <button
                onClick={goToNextStep}
                disabled={
                  (selectionType === "mentor" && !selectedMentorId) ||
                  (selectionType === "group" && !selectedGroupId)
                }
                className={`${styles.actionButton} ${styles.buttonPrimary}`}
              >
                次へ
              </button>
            </div>
          </div>
        );

      case 2: {
        if (selectionType === "mentor" && !selectedMentor) {
          return (
            <div className={styles.errorMessageContainer}>
              <p>
                メンター情報が見つかりません
                <br />
                一度「戻る」でメンターを選択してください。
              </p>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                戻る
              </button>
            </div>
          );
        } else if (selectionType === "group" && !selectedGroup) {
          return (
            <div className={styles.errorMessageContainer}>
              <p>
                グループ情報が見つかりません
                <br />
                一度「戻る」でグループを選択してください。
              </p>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                戻る
              </button>
            </div>
          );
        }

        const targetInfo =
          selectionType === "mentor" ? selectedMentor?.mentor : selectedGroup;

        return (
          <div>
            <div className={styles.stepTitleContainer}>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                <FaArrowLeft />
                戻る
              </button>
              <h2 className={styles.stepTitle}>日時を選択</h2>
            </div>
            <div className={styles.formGridMd12}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    選択した
                    {selectionType === "mentor" ? "メンター" : "グループ"}
                  </h3>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.selectedMentorInfo}>
                    <div className={styles.avatar}>
                      <img
                        src={
                          selectionType === "mentor"
                            ? selectedMentor?.mentor?.profile_image ?? undefined
                            : selectedGroup?.group_image ?? "/placeholder.png"
                        }
                        alt={""}
                      />
                    </div>
                    <div>
                      <div className={styles.mentorNameContainer}>
                        <h3 className={styles.mentorName}>
                          {"group_name" in (targetInfo ?? {})
                            ? (targetInfo as GroupChats).group_name
                            : (targetInfo as User)?.first_name}
                        </h3>
                        {selectionType === "mentor" &&
                          selectedMentor?.mentor?.ranks?.[1]?.rank_name && (
                            <span
                              className={`${styles.badge} ${styles.rankBadge} ${
                                selectedMentor.mentor.ranks?.[1]?.rank_name ===
                                "S"
                                  ? styles.rankBadgeS
                                  : styles.rankBadgeA
                              }`}
                            >
                              {selectedMentor.mentor.ranks?.[1].rank_name}
                            </span>
                          )}
                      </div>
                      {selectionType === "mentor" && (
                        <div className={styles.ratingContainer}>
                          <FaStar />
                          <span className={styles.ratingText}></span>
                          <span className={styles.ratingCount}></span>
                        </div>
                      )}
                      <div className={styles.categoriesContainer}>
                        {selectionType === "mentor" &&
                          selectedMentor?.mentor?.categories
                            .slice(0, 3)
                            .map((cat) => (
                              <span
                                key={cat.category_id}
                                className={styles.categoryBadge}
                              >
                                {cat.category_name}
                              </span>
                            ))}
                        {selectionType === "group" &&
                          selectedGroup?.category && (
                            <span className={styles.categoryBadge}>
                              {selectedGroup.category.category_name}
                            </span>
                          )}
                        {selectionType === "group" &&
                          selectedGroup?.member_count && (
                            <span className={styles.categoryBadge}>
                              メンバー: {selectedGroup.member_count}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <hr className={styles.infoSeparator} />
                  <div className={styles.infoRow}>
                    <FaCalendar />
                    <span>利用可能日:</span>
                  </div>
                  <div className={styles.infoRow}>
                    <FaMessage />
                    <span>返信時間:</span>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.dateViewTabsList}>
                  <button
                    onClick={() => setDateView("calendar")}
                    className={`${styles.dateViewTab} ${
                      dateView === "calendar" ? styles.dateViewTabActive : ""
                    }`}
                  >
                    カレンダー
                  </button>
                  <button
                    onClick={() => setDateView("list")}
                    className={`${styles.dateViewTab} ${
                      dateView === "list" ? styles.dateViewTabActive : ""
                    }`}
                  >
                    リスト
                  </button>
                </div>
                {dateView === "calendar" && (
                  <div>
                    <div className={styles.calendarNav}>
                      <h3>
                        {new Intl.DateTimeFormat("ja-JP", {
                          year: "numeric",
                          month: "long",
                        }).format(new Date(calendarYear, calendarMonth))}
                      </h3>
                      <div className={styles.calendarNavControls}>
                        <button
                          className={`${styles.actionButton} ${styles.buttonGhost}`}
                          onClick={() => changeMonth(-1)}
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.buttonOutline}`}
                          onClick={() => {
                            setCalendarMonth(currentMonth);
                            setCalendarYear(currentYear);
                          }}
                        >
                          今月
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.buttonGhost}`}
                          onClick={() => changeMonth(1)}
                        >
                          <FaArrowRight />
                        </button>
                      </div>
                    </div>
                    <div className={styles.calendarGrid}>
                      {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
                        <div key={d} className={styles.calendarGridHeader}>
                          {d}
                        </div>
                      ))}
                      {generateCalendarDays(calendarYear, calendarMonth).map(
                        (day, i) => {
                          const dateStr = day.date.toISOString().split("T")[0];
                          const isPastDate =
                            day.date <
                            new Date(
                              today.getFullYear(),
                              today.getMonth(),
                              today.getDate()
                            );

                          return (
                            <div
                              key={i}
                              className={`${styles.calendarDay} ${
                                !day.isCurrentMonth ? styles.dayNotInMonth : ""
                              } ${
                                day.isCurrentMonth && !isPastDate
                                  ? styles.dayAvailable
                                  : styles.dayDisabled
                              } ${
                                selectedDate === dateStr
                                  ? styles.daySelected
                                  : ""
                              }`}
                              onClick={() => {
                                if (day.isCurrentMonth && !isPastDate) {
                                  setSelectedDate(dateStr);
                                  setSelectedTime("");
                                }
                              }}
                            >
                              {day.date.getDate()}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
                {dateView === "list" && (
                  <div className={styles.dateList}>
                    {/* The `allDays` array currently contains just day names ("日", "月", etc.).
                        To make this list view functional for date selection, you would need
                        to populate `allDays` with actual date strings, similar to how
                        `demoTimeSlots` is generated. For this example, I'll keep the existing
                        `allDays` for demonstration but note that it won't allow date selection
                        in the same way as the calendar unless `allDays` is changed to actual dates.
                    */}
                    {demoTimeSlots.map((item) => (
                      <div
                        key={item.day} // Use item.day as key for unique dates
                        className={`${styles.dateListItem} ${
                          selectedDate === item.day
                            ? styles.dateListItemSelected
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(item.day);
                          setSelectedTime("");
                        }}
                      >
                        <div className={styles.infoRow}>
                          <FaCalendar />
                          <span>
                            {formatDate(item.day)} ({getDayOfWeek(item.day)})
                          </span>
                        </div>
                        <div className={styles.selectionCheck}>
                          <FaCheck />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedDate && (
                  <div className={styles.sectionMarginTop}>
                    <h3 className={styles.subHeading}>
                      {formatDate(selectedDate)}
                      の利用可能な時間
                    </h3>{" "}
                    <div className={styles.timeSlotGrid}>
                      {selectedDaySlots.map((time) => (
                        <button
                          key={time}
                          className={`${styles.timeSlotButton} ${
                            selectedTime === time ? styles.timeSlotSelected : ""
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}{" "}
                      {selectedDaySlots.length === 0 && (
                        <div className={styles.gridColumnSpan3}>
                          利用可能な時間がありません
                        </div>
                      )}{" "}
                    </div>{" "}
                  </div>
                )}
                {selectedTime && (
                  <div className={styles.sectionMarginTop}>
                    <h3 className={styles.subHeading}>面談時間</h3>
                    <div className={styles.radioGroupContainer}>
                      <div className={styles.radioItem}>
                        <input
                          type="radio"
                          id="d-30"
                          value="30"
                          checked={selectedDuration === "30"}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className={styles.radioInput}
                        />
                        <label htmlFor="d-30" className={styles.radioLabel}>
                          <span className={styles.radioCircle}>
                            <span className={styles.radioCircleInner}>
                              30分
                            </span>
                          </span>
                        </label>
                      </div>
                      <div className={styles.radioItem}>
                        <input
                          type="radio"
                          id="d-60"
                          value="60"
                          checked={selectedDuration === "60"}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className={styles.radioInput}
                        />
                        <label htmlFor="d-60" className={styles.radioLabel}>
                          <span className={styles.radioCircle}>
                            <span className={styles.radioCircleInner}>
                              60分
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.actionsContainer}>
              <button
                className={`${styles.actionButton} ${styles.buttonPrimary}`}
                onClick={goToNextStep}
                disabled={!selectedDate || !selectedTime}
              >
                次へ
              </button>
            </div>
          </div>
        );
      }

      case 3: {
        if (selectionType === "mentor" && !selectedMentor) {
          return (
            <div className={styles.errorMessageContainer}>
              <p>
                メンター情報が見つかりません
                <br />
                一度「戻る」でメンターを選択してください。
              </p>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                戻る
              </button>
            </div>
          );
        } else if (selectionType === "group" && !selectedGroup) {
          return (
            <div className={styles.errorMessageContainer}>
              <p>
                グループ情報が見つかりません
                <br />
                一度「戻る」でグループを選択してください。
              </p>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                戻る
              </button>
            </div>
          );
        }

        const summaryTargetInfo =
          selectionType === "mentor" ? selectedMentor?.mentor : selectedGroup;

        return (
          <div>
            <div className={styles.stepTitleContainer}>
              <button
                className={`${styles.actionButton} ${styles.buttonGhost}`}
                onClick={goToPreviousStep}
              >
                <FaArrowLeft />
              </button>
              <h2 className={styles.stepTitle}>面談の詳細</h2>
            </div>
            <div className={styles.formGridMd12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className={styles.formField}>
                  <label htmlFor="topic" className={styles.formLabel}>
                    面談トピック
                  </label>
                  <select
                    id="topic"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="" disabled>
                      トピックを選択
                    </option>
                    {topic.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="custom">その他（自由入力）</option>
                  </select>
                </div>
                {selectedTopic === "custom" && (
                  <div className={styles.formField}>
                    <label htmlFor="custom-topic" className={styles.formLabel}>
                      カスタムトピック
                    </label>
                    <input
                      id="custom-topic"
                      placeholder="面談のトピックを入力"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                )}
                <div className={styles.formField}>
                  <label htmlFor="description" className={styles.formLabel}>
                    詳細説明
                  </label>
                  <textarea
                    id="description"
                    placeholder="相談したい内容や質問を詳しく記入してください"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.formTextarea}
                  />
                </div>
                <div className={styles.alert}>
                  <FaInfo />
                  <div>
                    <h4 className={styles.alertTitle}>面談の準備</h4>
                    <p className={styles.alertDescription}>
                      面談を効果的にするため、事前に質問をまとめておくことをおすすめします。
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>予約内容の確認</h3>
                  <p className={styles.cardDescription}>
                    以下の内容で予約します
                  </p>
                </div>
                <div
                  className={`${styles.cardContent} ${styles.summaryCardContent}`}
                >
                  <div className={styles.selectedMentorInfo}>
                    <div className={styles.avatar}>
                      <img
                        src={
                          selectionType === "mentor"
                            ? selectedMentor?.mentor?.profile_image ?? undefined
                            : selectedGroup?.group_image ?? "/placeholder.png"
                        }
                        alt={
                          "group_name" in (summaryTargetInfo ?? {})
                            ? (summaryTargetInfo as GroupChats).group_name
                            : (summaryTargetInfo as User)?.first_name || ""
                        }
                      />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className={styles.mentorName}>
                        {" "}
                        {"group_name" in (summaryTargetInfo ?? {})
                          ? (summaryTargetInfo as GroupChats).group_name
                          : (summaryTargetInfo as User)?.first_name}{" "}
                      </div>{" "}
                      <div className={styles.mutedText}>
                        {" "}
                        {selectionType === "mentor" &&
                          selectedMentor?.mentor?.categories.map((cat) => (
                            <span
                              key={cat.category_id}
                              className={styles.categoryBadge}
                            >
                              {cat.category_name}{" "}
                            </span>
                          ))}{" "}
                        {selectionType === "group" &&
                          selectedGroup?.category && (
                            <span className={styles.categoryBadge}>
                              {selectedGroup.category.category_name}
                            </span>
                          )}
                      </div>{" "}
                    </div>{" "}
                  </div>
                  <hr className={styles.infoSeparator} />{" "}
                  <div className={styles.summaryRow}>
                    {" "}
                    <div className={styles.summaryValueContainer}>
                      <FaCalendar />{" "}
                      <span>
                        {" "}
                        {selectedDate &&
                          `${formatDate(selectedDate)} (${getDayOfWeek(
                            selectedDate
                          )})`}{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className={styles.summaryValueContainer}>
                      <FaClock />{" "}
                      <span>
                        {selectedTime} -{" "}
                        {selectedTime &&
                          (() => {
                            const startDate =
                              parseDateStringAsLocal(selectedDate);
                            const [hours, minutes] = selectedTime
                              .split(":")
                              .map(Number);
                            startDate.setHours(hours, minutes, 0, 0);
                            const durationInMinutes =
                              Number.parseInt(selectedDuration);
                            const endDate = new Date(startDate.getTime());
                            endDate.setMinutes(
                              endDate.getMinutes() + durationInMinutes
                            );
                            const endHours = endDate.getHours();
                            const endMinutes = endDate.getMinutes();
                            return `${endHours
                              .toString()
                              .padStart(2, "0")}:${endMinutes
                              .toString()
                              .padStart(2, "0")}`;
                          })()}{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className={styles.summaryValueContainer}>
                      <FaMessage /> <span>{selectedDuration}分間</span>{" "}
                    </div>{" "}
                  </div>
                  <hr className={styles.infoSeparator} />{" "}
                  <div className={styles.summaryRow}>
                    {" "}
                    <div className={styles.summaryLabel}>トピック</div>{" "}
                    <div className={styles.summaryValue}>
                      {" "}
                      {selectedTopic === "custom"
                        ? customTopic
                        : selectedTopic || "未選択"}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className={styles.actionsContainer}>
              {" "}
              <button
                className={`${styles.actionButton} ${styles.buttonOutline}`}
                onClick={goToPreviousStep}
              >
                戻る{" "}
              </button>{" "}
              <button
                onClick={confirmBooking}
                disabled={
                  !selectedTopic || (selectedTopic === "custom" && !customTopic)
                }
                className={`${styles.actionButton} ${styles.buttonPrimary}`}
              >
                予約を確定する{" "}
              </button>{" "}
            </div>{" "}
          </div>
        );
      }

      case 4:
        return (
          <div className={styles.successMessageContainer}>
            <p>予約が完了しました。</p>{" "}
            <button
              className={`${styles.actionButton} ${styles.buttonPrimary}`}
              onClick={() => (window.location.href = "/mentor")}
            >
              メンター一覧に戻る{" "}
            </button>{" "}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderStepContent()}</div>;
}
