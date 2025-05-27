import { createPatient } from "./actions"

export default function NewPatientPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">新規患者登録</h1>
        <a
          href="/"
          className="self-start sm:self-auto border rounded px-3 py-1 text-sm hover:bg-gray-100 transition"
        >
          ホームに戻る
        </a>
      </div>
      <form
        action={createPatient}
        className="bg-white border rounded shadow-sm p-6 space-y-6 max-w-2xl mx-auto"
      >
        {/* 氏名 */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            氏名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="例: 山田 太郎"
          />
        </div>
        {/* カルテ番号 */}
        <div>
          <label htmlFor="karte_no" className="block font-medium mb-1">
            カルテ番号
          </label>
          <input
            id="karte_no"
            name="karte_no"
            className="w-full border rounded px-3 py-2"
            placeholder="例: 12345"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        {/* 生年月日 */}
        <div>
          <label htmlFor="birthday" className="block font-medium mb-1">
            生年月日
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            className="w-full border rounded px-3 py-2"
            placeholder="例: 1958-04-01"
          />
        </div>
        {/* 性別 */}
        <div>
          <span className="block font-medium mb-1">
            性別 <span className="text-red-500">*</span>
          </span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" value="male" required />
              男性
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" value="female" required />
              女性
            </label>
          </div>
        </div>
        {/* 住所 */}
        <div>
          <label htmlFor="address" className="block font-medium mb-1">
            住所
          </label>
          <input
            id="address"
            name="address"
            className="w-full border rounded px-3 py-2"
            placeholder="例: 東京都千代田区..."
          />
        </div>
        {/* 電話番号 */}
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">
            電話番号
          </label>
          <input
            id="phone"
            name="phone"
            className="w-full border rounded px-3 py-2"
            placeholder="例: 090-1234-5678"
          />
        </div>
        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="例: yamada@example.com"
          />
        </div>
        {/* 備考 */}
        <div>
          <label htmlFor="notes" className="block font-medium mb-1">
            備考
          </label>
          <textarea
            id="notes"
            name="notes"
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            placeholder="その他特記事項があればご記入ください"
          />
        </div>
        {/* エラー表示 */}
        {searchParams?.error && (
          <div className="text-red-600 font-medium">{searchParams.error}</div>
        )}
        {/* 登録ボタン */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
