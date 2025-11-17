document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // ⚠️ 設定箇所: あなたのSupabaseプロジェクトの情報に置き換えてください
    // ----------------------------------------------------------------
   
NEXT_PUBLIC_SUPABASE_URL="https://vzgqrerdqhpgfxggvcci.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z3FyZXJkcWhwZ2Z4Z2d2Y2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjA2MzcsImV4cCI6MjA3ODkzNjYzN30.hugne9qqI-jHAb97yX7VR0cmKroRmtcCd9S_FkLCjFU"

    
    // Supabaseクライアントの初期化
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // ----------------------------------------------------------------

    const postButton = document.getElementById('post-button');
    const newPartInput = document.getElementById('new-part');
    const storyContainer = document.getElementById('story-container');
    const authStatus = document.getElementById('auth-status'); // HTMLに要素を追加することを想定

    // 認証状態のチェックと表示
    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            authStatus.textContent = `ログイン中: ${user.email}`;
            postButton.disabled = false;
        } else {
            authStatus.textContent = '未ログイン。投稿するにはログインが必要です。';
            postButton.disabled = true;
            // 実際にはログイン画面への誘導が必要
        }
        return user;
    }

    // 既存の小説データをデータベースから読み込み、表示する
    async function loadStory() {
        // 'stories'テーブルから全データを取得し、作成日時順に並べ替え
        let { data: storyParts, error } = await supabase
            .from('stories')
            .select('content, created_at, profiles(username)') // profilesテーブルと結合してユーザー名を取得（仮定）
            .order('created_at', { ascending: true });

        if (error) {
            console.error('データの取得に失敗:', error);
            storyContainer.innerHTML = '<p>物語を読み込めませんでした。</p>';
            return;
        }
        
        // コンテナをクリア
        storyContainer.innerHTML = '';

        if (storyParts.length === 0) {
            storyContainer.innerHTML = '<p class="story-part">物語の始まりです。誰かが続きを書くのを待っています。</p>';
            return;
        }

        // 取得したデータをHTMLに追加
        storyParts.forEach(part => {
            const newPartElement = document.createElement('p');
            newPartElement.classList.add('story-part');
            
            // 内容（content）と作者名を表示
            const authorName = part.profiles ? part.profiles.username : '匿名';
            const timestamp = new Date(part.created_at).toLocaleString();

            newPartElement.innerHTML = `
                ${part.content.replace(/\n/g, '<br>')}
                <span class="author-info">(${authorName}, ${timestamp})</span>
            `;
            storyContainer.appendChild(newPartElement);
        });
    }

    // 新しい文章を投稿する
    async function postNewPart() {
        const newText = newPartInput.value.trim();
        const user = await checkAuth();

        if (!user) {
            alert('投稿するにはログインが必要です。');
            return;
        }

        if (newText === '') {
            alert('続きの文章を入力してください。');
            return;
        }

        // データベースに挿入
        const { data, error } = await supabase
            .from('stories')
            .insert([
                { 
                    content: newText, 
                    author_id: user.id // 現在ログインしているユーザーのID
                }
            ]);

        if (error) {
            alert('投稿に失敗しました。エラーをコンソールで確認してください。');
            console.error('投稿エラー:', error);
            return;
        }
        
        // 投稿フォームをクリア
        newPartInput.value = '';
        
        // データを再読み込みして画面を更新
        loadStory(); 
        alert('新しい文章を投稿しました！');
    }

    // イベントリスナーのセットアップ
    postButton.addEventListener('click', postNewPart);

    // 初期処理の実行
    checkAuth(); // 認証状態の確認
    loadStory(); // 小説の読み込み
});
