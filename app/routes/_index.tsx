import type { MetaFunction } from "@remix-run/node";
import GameBoard from "~/components/GameBoard";

export const meta: MetaFunction = () => {
  return [
    { title: "送小动物回家游戏" },
    { name: "description", content: "一个有趣的送小动物回家游戏" },
  ];
};

export default function Index() {
  return <GameBoard />;
}
