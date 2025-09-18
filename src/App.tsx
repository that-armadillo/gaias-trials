import { useEffect, useState, type MouseEvent } from 'react'
import './App.css'

type AchievementStatus = 'in-progress' | 'completed'

type Achievement = {
  id: string
  title: string
  requirement: string
  progress: number
  target: number
  status: AchievementStatus
  icon: string
  flavor: string
  reward: string
  hidden?: boolean
  hint?: string
}

type Trial = {
  id: string
  title: string
  forecast: string
  reward: string
  icon: string
  tone: string
}

type PressureTrend = 'rising' | 'steady' | 'falling'
type AuroraPotential = 'none' | 'low' | 'watch' | 'high'

type WeatherSnapshot = {
  location: string
  cycleLabel: string
  consecutiveDays: number
  conditions: string
  temperature: number
  feelsLike: number
  windSpeed: number
  humidity: number
  precipitationMm: number
  snowDepthCm: number
  pressureHpa: number
  pressureTrend: PressureTrend
  visibilityKm: number
  uvIndex: number
  sunrise: string
  sunset: string
  dayLengthDeltaMinutes: number
  thunderPossible: boolean
  extremeHeatWarning: boolean
  extremeColdWarning: boolean
  auroraPotential: AuroraPotential
  atmosphericMood: string
}

const weatherSnapshot: WeatherSnapshot = {
  location: 'Skye, Scotland',
  cycleLabel: 'Day 142 · Luminous Storm Cycle',
  consecutiveDays: 18,
  conditions: 'Wind-swept drizzle',
  temperature: 12,
  feelsLike: 9,
  windSpeed: 52,
  humidity: 86,
  precipitationMm: 4.6,
  snowDepthCm: 0,
  pressureHpa: 1002,
  pressureTrend: 'falling',
  visibilityKm: 6.2,
  uvIndex: 2,
  sunrise: '06:12',
  sunset: '20:37',
  dayLengthDeltaMinutes: 3,
  thunderPossible: true,
  extremeHeatWarning: false,
  extremeColdWarning: false,
  auroraPotential: 'watch',
  atmosphericMood:
    'Gaia stirs the lochs with silvered gusts. Layers recommended, spirits high.'
}

const achievements: Achievement[] = [
  {
    id: 'rainmaster',
    title: 'Rainmaster Badge',
    requirement: 'Endure 20 rain-marked days',
    progress: 14,
    target: 20,
    status: 'in-progress',
    icon: '🌧️',
    flavor: 'Puddles become stepping stones once you learn the rhythm of rainfall.',
    reward: 'Badge + 250 Resilience points'
  },
  {
    id: 'sun-warrior',
    title: 'Sun Warrior',
    requirement: 'Witness a day over 30°C',
    progress: 1,
    target: 1,
    status: 'completed',
    icon: '☀️',
    flavor: 'When the air shimmers, you stand unfazed beneath blazing skies.',
    reward: 'Title + Solar Radiance stance cosmetic'
  },
  {
    id: 'tempest-tamer',
    title: 'Tempest Tamer',
    requirement: 'Face winds stronger than 50 km/h',
    progress: 0,
    target: 3,
    status: 'in-progress',
    icon: '🌪️',
    flavor: 'Stormfronts test even the bold. Prepare your cloak and steady your footing.',
    reward: 'Badge + 1 Weather Ward charge',
    hidden: true,
    hint: 'Reveals after your first gale-force alert.'
  }
]

const upcomingTrials: Trial[] = [
  {
    id: 'heatwave',
    title: 'Blazing Vigil',
    forecast: '30°C surge forecast in 3 days',
    reward: '+20% Sun Warrior progress',
    icon: '🔥',
    tone: 'Gather cooling tonics and sun charms before the heat crest arrives.'
  },
  {
    id: 'frost-watch',
    title: 'Frost Watch',
    forecast: 'Night frost likely mid-week',
    reward: 'Unlock: Frost Whisper quest line',
    icon: '❄️',
    tone: 'Chart the constellations and prepare warding embers for the chill.'
  },
  {
    id: 'storm-prowl',
    title: 'Storm Prowl',
    forecast: 'Wind gusts building to 60 km/h on Saturday',
    reward: 'Claim Tempest Tamer sigil',
    icon: '⚡',
    tone: 'Secure camp, reinforce shelters, and brace for roaring skies.'
  }
]

const statusLabels: Record<AchievementStatus, string> = {
  'in-progress': 'In Progress',
  completed: 'Completed'
}

const statusAccent: Record<AchievementStatus, string> = {
  'in-progress': 'accent',
  completed: 'success'
}

type PracticalSignal = {
  label: string
  value: string
  note?: string
}

type ElementalInsight = {
  label: string
  value: string
  note: string
}

function getTemperatureEmoji(temp: number): string {
  if (temp >= 30) return '🔥'
  if (temp >= 20) return '🌞'
  if (temp >= 10) return '🌤️'
  if (temp >= 0) return '🌥️'
  return '❄️'
}

function getConditionEmoji(conditions: string): string {
  const condition = conditions.toLowerCase()
  if (condition.includes('storm') || condition.includes('thunder')) return '⛈️'
  if (condition.includes('drizzle') || condition.includes('rain')) return '🌧️'
  if (condition.includes('snow')) return '❄️'
  if (condition.includes('wind')) return '💨'
  if (condition.includes('cloud')) return '☁️'
  if (condition.includes('sun') || condition.includes('clear')) return '☀️'
  return '🌍'
}

function getWindEmoji(speedKmh: number): string {
  if (speedKmh >= 70) return '🌪️'
  if (speedKmh >= 45) return '💨'
  if (speedKmh >= 15) return '🍃'
  return '🌬️'
}

function getHumidityEmoji(humidity: number): string {
  if (humidity >= 80) return '💧'
  if (humidity >= 50) return '💦'
  if (humidity >= 30) return '🌫️'
  return '🌵'
}

function buildPracticalSignals(snapshot: WeatherSnapshot): PracticalSignal[] {
  const signals: PracticalSignal[] = []

  if (snapshot.precipitationMm > 0) {
    const intensity = snapshot.precipitationMm >= 10 ? 'Steady showers soak the paths.' : 'Light drizzles patter through the glens.'
    signals.push({
      label: 'Precipitation 💧',
      value: `${snapshot.precipitationMm.toFixed(1)} mm rainfall ${snapshot.precipitationMm >= 8 ? '🌧️' : '🌦️'}`,
      note: intensity
    })
  } else {
    signals.push({
      label: 'Precipitation 💧',
      value: 'No rainfall today. ☀️',
      note: 'Ground remains firm beneath your boots.'
    })
  }

  if (snapshot.snowDepthCm > 0) {
    signals.push({
      label: 'Snow Depth ❄️',
      value: `${snapshot.snowDepthCm.toFixed(1)} cm`,
      note: 'Fresh powder cloaks the trail. ❄️'
    })
  }

  const pressureNotes: Record<PressureTrend, string> = {
    rising: 'Pressure rising — skies steadying. 📈',
    steady: 'Pressure steady — balance holds. ⚖️',
    falling: 'Pressure falling — storms brewing. 📉'
  }

  signals.push({
    label: 'Pressure 📊',
    value: `${snapshot.pressureHpa} hPa`,
    note: pressureNotes[snapshot.pressureTrend]
  })

  const visibilityNote = snapshot.visibilityKm < 2
    ? 'Mist veils the horizon. 🌫️'
    : snapshot.visibilityKm < 5
      ? 'Haze softens distant peaks. 👁️'
      : 'Clear sightlines span the lochs. 🔭'

  signals.push({
    label: 'Visibility 👁️',
    value: `${snapshot.visibilityKm.toFixed(1)} km`,
    note: visibilityNote
  })

  const uv = snapshot.uvIndex
  const uvNote = uv >= 8
    ? 'Sun at zenith — ward your skin. 🔥'
    : uv >= 6
      ? 'Bright rays demand light armor. 😎'
      : uv >= 3
        ? 'Moderate glow — wards optional. 🌞'
        : 'Soft winter sun peers through clouds. 🌥️'

  signals.push({
    label: 'UV Index ☀️',
    value: `${uv} / 11`,
    note: uvNote
  })

  signals.push({
    label: 'Sun Cycle 🌅',
    value: `Dawn ${snapshot.sunrise} · Dusk ${snapshot.sunset}`,
    note: describeSeasonalShift(snapshot.dayLengthDeltaMinutes)
  })

  return signals
}

function deriveElementalInsights(snapshot: WeatherSnapshot): ElementalInsight[] {
  return [deriveElementalAttunement(snapshot), deriveStormThreat(snapshot), deriveSeasonalDrift(snapshot)]
}

function deriveElementalAttunement(snapshot: WeatherSnapshot): ElementalInsight {
  if (snapshot.extremeColdWarning || snapshot.temperature <= 0 || snapshot.snowDepthCm > 0) {
    return {
      label: 'Elemental Attunement',
      value: 'Frostbound ❄️',
      note: 'Cold anchors the day — conserve warmth and stamina.'
    }
  }

  if (snapshot.extremeHeatWarning || snapshot.uvIndex >= 7 || snapshot.temperature >= 28) {
    return {
      label: 'Elemental Attunement',
      value: 'Solar Blaze 🔥',
      note: 'Sunfire pulses strongly — hydration and shade advised.'
    }
  }

  if (snapshot.windSpeed >= 45) {
    return {
      label: 'Elemental Attunement',
      value: 'Air Dominant 💨',
      note: 'Expect clarity and motion — winds lead today’s trial.'
    }
  }

  if (snapshot.precipitationMm >= 5 || snapshot.conditions.toLowerCase().includes('rain')) {
    return {
      label: 'Elemental Attunement',
      value: 'Waterbound 🌊',
      note: 'Moisture saturates the cycle — embrace fluid tactics.'
    }
  }

  return {
    label: 'Elemental Attunement',
    value: 'Earth Steady 🪨',
    note: 'Balanced forces — steady footing and patience prevail.'
  }
}

function deriveStormThreat(snapshot: WeatherSnapshot): ElementalInsight {
  if (snapshot.thunderPossible || snapshot.windSpeed >= 65) {
    return {
      label: 'Storm Threat',
      value: 'Tempest ⚡',
      note: 'Thunderheads prowl nearby — secure shelters and wards.'
    }
  }

  if (snapshot.windSpeed >= 45 || snapshot.pressureTrend === 'falling' || snapshot.precipitationMm >= 8) {
    return {
      label: 'Storm Threat',
      value: 'Brewing 🌩️',
      note: 'Barometer dips and gusts rise — brace for intensifying weather.'
    }
  }

  return {
    label: 'Storm Threat',
    value: 'Calm 🌈',
    note: 'Skies hold gentle equilibrium — minimal disruption expected.'
  }
}

function deriveSeasonalDrift(snapshot: WeatherSnapshot): ElementalInsight {
  const delta = snapshot.dayLengthDeltaMinutes
  const symbol = delta > 0 ? `+${delta}` : delta === 0 ? '±0' : `-${Math.abs(delta)}`
  const seasonalEmoji = delta > 0 ? '🌱' : delta < 0 ? '🍂' : '⚖️'
  const note = delta > 0
    ? 'Light lingers longer than the last cycle. 🌅'
    : delta < 0
      ? 'Night encroaches, reclaiming minutes from the day. 🌙'
      : 'Day length holds steady against the turning wheel. ⚖️'

  return {
    label: 'Seasonal Drift',
    value: `${symbol} min daylight shift ${seasonalEmoji}`,
    note
  }
}

function describeSeasonalShift(deltaMinutes: number): string {
  if (deltaMinutes > 0) {
    return `+${deltaMinutes} minutes of light gained since last cycle. 🌅`
  }

  if (deltaMinutes < 0) {
    return `${Math.abs(deltaMinutes)} minutes of light lost since last cycle. 🌙`
  }

  return 'Day length unchanged since the previous cycle. ⚖️'
}

function deriveRareEvents(snapshot: WeatherSnapshot): string[] {
  const events: string[] = []

  if (snapshot.thunderPossible) {
    events.push('Thunderheads detected — lightning wards advised. ⚡')
  }

  if (snapshot.extremeHeatWarning) {
    events.push('Extreme heat warning — hydrate and seek shade. 🔥')
  }

  if (snapshot.extremeColdWarning) {
    events.push('Severe cold warning — bolster layers and rations. 🥶')
  }

  if (snapshot.auroraPotential === 'high') {
    events.push('High aurora potential — expect vivid celestial curtains. 🌌')
  } else if (snapshot.auroraPotential === 'watch') {
    events.push('Aurora watch in effect — sky may shimmer tonight. 🌌')
  }

  return events
}

function ProgressBar({ progress, target }: { progress: number; target: number }) {
  const percentage = Math.min(100, Math.round((progress / target) * 100))

  return (
    <div className="progress-bar" aria-hidden="true">
      <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'trials'>('achievements')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showHidden, setShowHidden] = useState(false)
  const windSpeedMs = Number((weatherSnapshot.windSpeed / 3.6).toFixed(1))
  const visibleAchievements = achievements.filter((achievement) => !achievement.hidden)
  const hiddenAchievements = achievements.filter((achievement) => achievement.hidden)
  const questsInProgress = visibleAchievements.filter((achievement) => achievement.status === 'in-progress').length
  const practicalSignals = buildPracticalSignals(weatherSnapshot)
  const elementalInsights = deriveElementalInsights(weatherSnapshot)
  const rareEvents = deriveRareEvents(weatherSnapshot)
  const temperatureEmoji = getTemperatureEmoji(weatherSnapshot.temperature)
  const feelsLikeEmoji = getTemperatureEmoji(weatherSnapshot.feelsLike)
  const conditionEmoji = getConditionEmoji(weatherSnapshot.conditions)
  const windEmoji = getWindEmoji(weatherSnapshot.windSpeed)
  const humidityEmoji = getHumidityEmoji(weatherSnapshot.humidity)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleThemeToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0) {
      event.currentTarget.blur()
    }
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const handleTabSelect = (tab: 'achievements' | 'trials') => (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0) {
      event.currentTarget.blur()
    }
    setActiveTab(tab)
  }

  const handleHiddenToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail !== 0) {
      event.currentTarget.blur()
    }
    setShowHidden((prev) => !prev)
  }

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="hero-panel__content">
          <div className="hero-panel__top-row">
            <span className="hero-panel__whisper">Weather-forged quest log</span>
            <button
              type="button"
              className="theme-toggle"
              onClick={handleThemeToggle}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
          <h1>Gaia&rsquo;s Trials</h1>
          <p>
            Chronicle elemental shifts, earn badges for the days you endure, and keep your
            guild prepared for the next sky-borne challenge.
          </p>
          <button className="cta-button">Sync today&rsquo;s forecast</button>
        </div>
        <dl className="hero-panel__stats">
          <div>
            <dt>Current Sanctum</dt>
            <dd>{weatherSnapshot.location}</dd>
          </div>
          <div>
            <dt>Cycle Chronicle</dt>
            <dd>{weatherSnapshot.cycleLabel}</dd>
          </div>
          <div>
            <dt>Consecutive Days</dt>
            <dd>{weatherSnapshot.consecutiveDays}</dd>
          </div>
          <div>
            <dt>Quests In Progress</dt>
            <dd>{questsInProgress}</dd>
          </div>
        </dl>
      </header>

      <main className="board-stack">
        <section className="board-panel board-panel--report">
          <header className="board-panel__header">
            <h2>Elemental Report 🌍</h2>
          </header>
          <div className="weather-metric">
            <div className="weather-metric__value">
              <span className="weather-metric__temp">{weatherSnapshot.temperature}°C {temperatureEmoji}</span>
              <span className="weather-metric__detail">Feels like {weatherSnapshot.feelsLike}°C {feelsLikeEmoji}</span>
            </div>
            <div className="weather-metric__conditions">
              <span className="weather-metric__label">Conditions</span>
              <strong>
                {weatherSnapshot.conditions} {conditionEmoji}
              </strong>
            </div>
          </div>
          <dl className="weather-stats">
            <div>
              <dt>Wind</dt>
              <dd>
                {windSpeedMs} m/s {windEmoji}
              </dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>
                {weatherSnapshot.humidity}% {humidityEmoji}
              </dd>
            </div>
          </dl>
          <div className="weather-secondary">
            <section className="weather-block">
              <h3 className="weather-block__title">Practical Signals</h3>
              <dl className="metric-grid">
                {practicalSignals.map((signal) => (
                  <div className="metric-grid__item" key={signal.label}>
                    <dt>{signal.label}</dt>
                    <dd>
                      <span className="metric-grid__value">{signal.value}</span>
                      {signal.note && <span className="metric-grid__note">{signal.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="weather-block">
              <h3 className="weather-block__title">Elemental Briefing</h3>
              <ul className="elemental-briefing">
                {elementalInsights.map((insight) => (
                  <li key={insight.label} className="elemental-briefing__item">
                    <span className="elemental-briefing__label">{insight.label}</span>
                    <span className="elemental-briefing__value">{insight.value}</span>
                    <p className="elemental-briefing__note">{insight.note}</p>
                  </li>
                ))}
              </ul>
              {rareEvents.length > 0 && (
                <div className="rare-events">
                  <span className="rare-events__label">Rare Signs</span>
                  <ul className="rare-events__list">
                    {rareEvents.map((event) => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
          <p className="weather-lore">{weatherSnapshot.atmosphericMood} {conditionEmoji}</p>
        </section>

        <section className="board-panel">
          <header className="board-panel__header board-panel__header--split">
            <div>
              <h2>Quest Board</h2>
              <p className="board-panel__subhead">
                Keep achievements and upcoming trials within arm&rsquo;s reach.
              </p>
            </div>
            <div className="tab-switch" role="tablist" aria-label="Quest board view">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'achievements'}
                className={`tab-switch__button ${activeTab === 'achievements' ? 'is-active' : ''}`}
                onClick={handleTabSelect('achievements')}
              >
                Achievements
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'trials'}
                className={`tab-switch__button ${activeTab === 'trials' ? 'is-active' : ''}`}
                onClick={handleTabSelect('trials')}
              >
                Upcoming Trials
              </button>
            </div>
          </header>

          <div className="board-panel__body">
            {activeTab === 'achievements' ? (
              <div className="achievement-stack">
                <div className="achievement-list">
                  {visibleAchievements.map((achievement) => (
                    <article className="achievement-card" key={achievement.id}>
                      <div className="achievement-card__icon" aria-hidden="true">
                        {achievement.icon}
                      </div>
                      <div className="achievement-card__body">
                        <div className="achievement-card__header">
                          <h3>{achievement.title}</h3>
                          <span className={`status-pill status-pill--${statusAccent[achievement.status]}`}>
                            {statusLabels[achievement.status]}
                          </span>
                        </div>
                        <p className="achievement-card__requirement">{achievement.requirement}</p>
                        <ProgressBar progress={achievement.progress} target={achievement.target} />
                        <div className="achievement-card__meta">
                          <span>
                            {achievement.progress}/{achievement.target} milestones
                          </span>
                          <span className="achievement-card__reward">Reward: {achievement.reward}</span>
                        </div>
                        <p className="achievement-card__flavor">{achievement.flavor}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {hiddenAchievements.length > 0 && (
                  <div className="hidden-quests">
                    <button
                      type="button"
                      className={`hidden-quests__toggle ${showHidden ? 'is-active' : ''}`}
                      onClick={handleHiddenToggle}
                      aria-expanded={showHidden}
                    >
                      {showHidden
                        ? 'Hide secret trials'
                        : `Reveal ${hiddenAchievements.length} secret trial${hiddenAchievements.length > 1 ? 's' : ''}`}
                    </button>
                    {showHidden && (
                      <ul className="hidden-quests__list">
                        {hiddenAchievements.map((quest) => (
                          <li key={quest.id} className="hidden-quest-card">
                            <div className="hidden-quest-card__icon" aria-hidden="true">
                              {quest.icon}
                            </div>
                            <div className="hidden-quest-card__body">
                              <h3>{quest.title}</h3>
                              <p className="hidden-quest-card__hint">???????</p>
                              <p className="hidden-quest-card__reward">Reward: {quest.reward}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <ul className="trial-list">
                {upcomingTrials.map((trial) => (
                  <li key={trial.id} className="trial-card">
                    <div className="trial-card__icon" aria-hidden="true">
                      {trial.icon}
                    </div>
                    <div className="trial-card__body">
                      <h3>{trial.title}</h3>
                      <p className="trial-card__forecast">{trial.forecast}</p>
                      <p className="trial-card__tone">{trial.tone}</p>
                    </div>
                    <span className="trial-card__reward">{trial.reward}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="board-panel board-panel--accent">
          <header className="board-panel__header">
            <h2>Season Chronicle</h2>
          </header>
          <div className="season-placeholder">Reserved for upcoming lore features.</div>
        </section>
      </main>
    </div>
  )
}

export default App
