"use client";
import Link from "next/link";
import Telegram from "../../../public/Telegram";
import Mail from "../../../public/Mail";

export default function Dashboard() {
  return (
    <div className="lg:w-screen lg:h-screen flex lg:flex-row flex-col lg:gap-2 justify-center items-top lg:pt-24 pt-16 lg:px-4">
      <div className="lg:h-[80vh] w-screen bg-white lg:rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
        <div className="font-bold text-2xl">PIX Logistic</div>
        <div className="lg:flex flex-row lg:justify-between gap-4">
          <div className="lg:max-w-[500px] lg:mt-0 mt-4">
            <h1 className="text-1xl font-bold">Бот в телеграм</h1>
            <div className="mt-4">У нас появился бот в телеграм. Он присылает информацию по заказу, когда заказ меняет статус.<br /> Чтобы подключить бота, перейдите по ссылке и следуйте инструкциям в боте:<br /> <Link prefetch={true} className="text-blue-400 hover:underline" href="https://t.me/pix_logistic_bot">https://t.me/pix_logistic_bot</Link></div>
          </div>
          <div className="lg:max-w-[500px] lg:text-center lg:mt-0 mt-4">
            <h1 className="text-1xl font-bold">Для новых пользователей</h1>
            <div className="mt-4">Чтобы сделать заказ, откройте меню в левом верхнем углу и перейдите в раздел <span className="font-bold">Новый заказ</span>.</div>
            <div className="mt-4">Чтобы отследить заказ, откройте меню и перейдите в раздел <span className="font-bold">Мои заказы</span>, далее Вы можете перейти в сам заказ, нажав на его номер.</div>
            <div className="mt-4">В разделе <span className="font-bold">Транзакции</span> Вы можете посмотреть свои счета на оплаты заказов.</div>
            <div className="mt-4">Если у вас есть общий вопрос по работе с сайтом, нажмите на иконку <span className="font-bold">Чата</span> в правом нижнем углу и задайте свой вопрос, наш менеджер ответит на него через некоторое время.</div>
            <div className="mt-4">Если у вас есть вопрос по заказу, перейдите в <span className="font-bold">нужный заказ</span> справа внизу будет раздел общения с вашим менеджером по заказу.</div>
          </div>
          <div className="lg:max-w-[500px] lg:text-right lg:mt-0 mt-4">
            <h1 className="text-1xl font-bold">Как происходит оформление заказа</h1>
            <div className="mt-4">После оформления заказа, наш менеджер просчитывает заказ и заносит цену на сайт. Далее Вы можете согласиться с ценой и нажать <span className="font-bold">Подтвердить заказ</span> или изменить заказ, например изменить количество или удалить позицию. Если вы передумали заказывать, нажмите на <span className="font-bold">Отказаться</span>.<br />После подтверждения заказа мы начнём готовить ваш заказ к отправке в РФ, вам будет необходимо оплатить заказ.</div>
          </div>
        </div>
        <div className="flex mt-16 gap-8 justify-center">
          <Telegram fill="black" />
          <Mail fill="black" />
          {/* <Whatsapp /> */}
        </div>
      </div>
    </div>
  );
}
