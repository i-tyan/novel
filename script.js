document.addEventListener('DOMContentLoaded', () => {
    const postButton = document.getElementById('post-button');
    const newPartInput = document.getElementById('new-part');
    const storyContainer = document.getElementById('story-container');
const SUPABASE_URL = 'あなたのSupabase URL'; 
const SUPABASE_ANON_KEY = 'あなたのAnon Key'; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // 投稿ボタンがクリックされたときの処理
    postButton.addEventListener('click', () => {
        const newText = newPartInput.value.trim();

        if (newText === '') {
            alert('続きの文章を入力してください。');
            return;
        }
        async function loadStory() {
    // 'stories'テーブルから全データを取得し、作成日時順に並べ替え
    let { data: storyParts, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('データの取得に失敗:', error);
        return;
    }
    
    // 取得したデータをHTMLに表示する処理...
    // storyParts.forEach(part => { /* HTMLに追加 */ });
}
        async function postNewPart(newText, userId) {
    const { data, error } = await supabase
        .from('stories')
        .insert([
            { content: newText, author_id: userId } // ログインユーザーのIDを含める
        ]);

    if (error) {
        alert('投稿に失敗しました。ログイン状態を確認してください。');
        console.error('投稿エラー:', error);
        return;
    }
    
    alert('新しい文章を投稿しました！');
    // 画面を更新して最新の文章を表示
    loadStory(); 
}

// 投稿ボタンのクリックイベントからこの関数を呼び出す

        // 実際には、ここでサーバーのAPIを呼び出してデータを保存する処理が入ります
        // 例: fetch('/api/story/post', { method: 'POST', body: JSON.stringify({ content: newText }) })
        
        // --- デモ処理: 画面に新しい文章を追加 ---
        const newPartElement = document.createElement('p');
        newPartElement.classList.add('story-part');
        
        // 入力されたテキストの改行をHTMLの <br> タグに変換
        newPartElement.innerHTML = newText.replace(/\n/g, '<br>');
        
        // 小説コンテナの末尾に追加
        storyContainer.appendChild(newPartElement);

        // 投稿フォームをクリア
        newPartInput.value = '';

        // スムーズに新しい投稿部分までスクロール
        newPartElement.scrollIntoView({ behavior: 'smooth' });

        alert('文章を投稿しました！（※画面上でのみ追加されています）');
        // ------------------------------------------
    });
});
