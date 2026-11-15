import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Droplets, Wind, Sparkles, ChevronDown } from 'lucide-react';
import { weatherService, WeatherData, defaultCities } from '../../services/weatherService';

export const WeatherWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    weatherService.getWeather(city).then((data) => {
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [city]);

  if (!weather) return null;

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowCityPicker((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-[#1C1B24]/90 px-3.5 py-1.5 shadow-xs border border-white/60 dark:border-[#292833] hover:bg-white transition-all text-xs font-bold"
        >
          <span className="text-base">{weather.icon}</span>
          <span>{weather.temperature}°C</span>
          <span className="text-[#8E8B99] hidden sm:inline">• {weather.city}</span>
          <ChevronDown className="h-3 w-3 text-[#8E8B99]" />
        </button>

        {showCityPicker && (
          <div className="absolute left-0 mt-2 w-48 rounded-[24px] bg-white p-2.5 shadow-2xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] z-50 animate-in fade-in">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8E8B99]">
              Select City
            </p>
            {defaultCities.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCity(c.name);
                  setShowCityPicker(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                  city === c.name
                    ? 'bg-[#7065F0] text-white'
                    : 'text-[#18171E] hover:bg-[#F4F3F8] dark:text-white dark:hover:bg-[#292833]'
                }`}
              >
                <span>{c.name}</span>
                {city === c.name && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[32px] bg-gradient-to-br from-[#7065F0]/10 via-[#ECEAFE] to-[#FF5EEA]/10 p-6 border border-white/80 dark:border-[#292833] shadow-md dark:bg-none dark:bg-[#1C1B24] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7065F0] text-white shadow-xs">
            <CloudSun className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowCityPicker(!showCityPicker)}>
              <span className="text-xs font-extrabold text-[#18171E] dark:text-white flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#7065F0]" /> {weather.city}
              </span>
              <ChevronDown className="h-3 w-3 text-[#8E8B99]" />
            </div>
            <p className="text-[11px] font-medium text-[#8E8B99]">{weather.condition}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-extrabold text-[#18171E] dark:text-white">
            {weather.temperature}°C
          </span>
          <p className="text-[10px] font-bold text-[#8E8B99]">H: {weather.high}° L: {weather.low}°</p>
        </div>
      </div>

      {/* City Dropdown modal */}
      {showCityPicker && (
        <div className="rounded-2xl bg-white p-2 shadow-lg dark:bg-[#292833] grid grid-cols-2 gap-1 animate-in fade-in">
          {defaultCities.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setCity(c.name);
                setShowCityPicker(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl text-left transition-colors ${
                city === c.name
                  ? 'bg-[#7065F0] text-white'
                  : 'text-[#18171E] hover:bg-[#F4F3F8] dark:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Weather Task Advice Banner */}
      <div className="rounded-2xl bg-white/80 dark:bg-[#292833]/70 p-3 flex items-start gap-2.5 text-xs">
        <Sparkles className="h-4 w-4 text-[#7065F0] shrink-0 mt-0.5" />
        <p className="font-semibold text-[#18171E] dark:text-white leading-relaxed">
          {weather.taskAdvice}
        </p>
      </div>

      {/* Hourly Forecast Rail */}
      <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto">
        {weather.hourly.map((h, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/70 dark:bg-[#292833]/60 min-w-[50px] shadow-2xs"
          >
            <span className="text-[10px] font-bold text-[#8E8B99]">{h.time}</span>
            <span className="text-base my-1">{h.icon}</span>
            <span className="text-xs font-extrabold text-[#18171E] dark:text-white">{h.temp}°</span>
          </div>
        ))}
      </div>

      {/* Extra Metrics */}
      <div className="flex items-center justify-around pt-1 text-[11px] font-bold text-[#8E8B99]">
        <div className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5 text-[#54C5FF]" />
          <span>Humidity: {weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-3.5 w-3.5 text-[#7065F0]" />
          <span>Wind: {weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
