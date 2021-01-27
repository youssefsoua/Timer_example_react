import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPauseCircle,
  faTimesCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons'
import night from './assets/images/night.png'
import morning from './assets/images/morning.png'
import alarmSound from './assets/audio/alarm.mp3'

function App() {
  const bgImage =
    new Date().getHours() < 18 && new Date().getHours() > 6 ? morning : night

  const intervalRef = useRef(null)
  const [audio] = useState(new Audio(alarmSound))
  const [paused, setPaused] = useState(true)
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [time, setTime] = useState(hours * 3600 + minutes * 60 + seconds)

  useEffect(() => {
    setTime(hours * 3600 + minutes * 60 + seconds)
  }, [hours, minutes, seconds])

  useEffect(() => {
    if (elapsed) {
    }
    elapsed ? audio.play() : audio.pause()
  }, [elapsed, audio])

  const onStartHandler = () => {
    if (paused) {
      setPaused(!paused)
    }
    setStarted(true)
    intervalRef.current = setInterval((time) => {
      setTime((time) => {
        if (time >= 1) {
          return time - 1
        } else if (time === 0) {
          if (elapsed === false) setElapsed(true)
          audio.load()
          audio.loop = true
          onResetHandler()
        }
      })
    }, 1000)
  }

  const onPauseHandler = () => {
    clearInterval(intervalRef.current)
    setPaused(true)
  }

  const onResetHandler = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setStarted(false)
    setPaused(true)
    setTime(0)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
  }

  return (
    <div
      className='container homepage-bgimage'
      style={{ backgroundImage: 'url(' + bgImage + ')' }}
    >
      <div className='container card col'>
        <h1 className='title'>Timer with Alarm</h1>
        <div style={{ fontSize: started ? '8vh' : '6vh' }}>
          <span>
            {(started ? Math.floor(time / 3600) : hours)
              .toString()
              .padStart(2, '0')}
          </span>
          <span>:</span>
          <span>
            {(started ? Math.floor((time % 3600) / 60) : minutes)
              .toString()
              .padStart(2, '0')}
          </span>
          <span>:</span>
          <span>
            {(started ? Math.floor((time % 3600) % 60) : seconds)
              .toString()
              .padStart(2, '0')}
          </span>
        </div>
        {!started && !elapsed && (
          <div className='container'>
            <div className='container col'>
              <input
                type='number'
                className='time-Input'
                style={{ width: '20vw', height: '5vh' }}
                min='0'
                max='23'
                value={hours}
                onChange={(e) =>
                  setHours(
                    e.target.value > 23
                      ? 23
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
              />
              <label style={{ fontSize: '3vh' }}>Hrs</label>
            </div>
            <div className='container col'>
              <input
                type='number'
                className='time-Input'
                style={{ width: '20vw', height: '5vh' }}
                min='0'
                max='59'
                value={minutes}
                onChange={(e) =>
                  setMinutes(
                    e.target.value > 59
                      ? 59
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
              />
              <label style={{ fontSize: '3vh' }}>Mins</label>
            </div>
            <div className='container col'>
              <input
                type='number'
                className='time-Input'
                style={{ width: '20vw', height: '5vh' }}
                min='0'
                max='59'
                value={seconds}
                onChange={(e) =>
                  setSeconds(
                    e.target.value > 59
                      ? 59
                      : e.target.value < 0
                      ? 0
                      : e.target.value
                  )
                }
              />
              <label style={{ fontSize: '3vh' }}>Secs</label>
            </div>
          </div>
        )}
        <div className='container'>
          {paused && !elapsed && (
            <button
              className='circle'
              onClick={onStartHandler}
              disabled={time === 0}
            >
              <FontAwesomeIcon icon={faPlay} size='5x' />
            </button>
          )}
          {started && !paused && !elapsed && (
            <button className='circle' onClick={onPauseHandler}>
              <FontAwesomeIcon icon={faPauseCircle} size='5x' />
            </button>
          )}
          {!elapsed && (
            <button className='circle' onClick={onResetHandler}>
              <FontAwesomeIcon icon={faSyncAlt} size='5x' />
            </button>
          )}
          {elapsed && (
            <button className='circle' onClick={() => setElapsed(false)}>
              <FontAwesomeIcon icon={faTimesCircle} size='5x' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
