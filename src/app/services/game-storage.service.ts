import { Injectable } from '@angular/core';
import { GameData } from '../types/game-data';
import { GameStorage } from '../types/game-storage';

@Injectable({ providedIn: 'root' })
export class GameStorageService implements GameStorage {
  public readonly key = 'RAIN-GRABBER';

  private _storage<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public add(value: GameData): void {
    this._storage(() => {
      const data = JSON.stringify(value);

      localStorage.setItem(this.key, data);
    });
  }

  public delete(): void {
    this._storage(() => {
      localStorage.removeItem(this.key);
    });
  }

  public update(value: Partial<GameData>): GameData | null {
    return this._storage(() => {
      const storeData = localStorage.getItem(this.key);

      if (storeData === null) {
        return null;
      }

      const data = JSON.parse(storeData);

      const newData: GameData = { ...data, ...value };

      localStorage.setItem(this.key, JSON.stringify(newData));

      return newData;
    });
  }

  public get(): GameData | null {
    return this._storage<GameData>(() => {
      const storeData = localStorage.getItem(this.key);

      if (storeData === null) {
        return null;
      }

      return JSON.parse(storeData);
    });
  }
}
