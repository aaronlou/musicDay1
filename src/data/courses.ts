import type { Course } from "@/types";

export const musicTheoryCourse: Course = {
  id: "music-theory-fundamentals",
  title: "乐理基础全攻略",
  description:
    "从零开始系统学习音乐理论，涵盖音符、节拍、音阶、音程、和弦等核心知识。完成本课程后，你将具备扎实的乐理基础，学习任何乐器都会事半功倍。",
  chapters: [
    {
      id: "ch1",
      title: "第一章：音乐入门",
      description: "了解音乐的基本构成，认识音符与节奏",
      icon: "Music",
      order: 1,
      lessons: [
        {
          id: "l1-1",
          order: 1,
          title: "什么是音乐？",
          subtitle: "音的产生与特性",
          content: [
            "音乐是由有组织的声音构成的艺术形式。要理解音乐，首先要了解「音」的本质。",
            "音的产生：物体振动产生音波，音波传入人耳，我们就听到了声音。音乐中使用的音，是有固定音高的音，我们称之为「乐音」。",
            "乐音有四个基本属性：\n\n1. 音高（Pitch）：由振动频率决定，频率越高音越高\n2. 音长（Duration）：音持续的时间长短\n3. 音量（Volume/Intensity）：由振幅决定，振幅越大音量越大\n4. 音色（Timbre）：由发声体的材质和泛音决定，让我们能分辨钢琴和小提琴",
            "音乐正是通过这四个要素的变化组合，创造出丰富多彩的音响效果。",
          ],
          tips: [
            "试着拍手：快速连续拍手音高不变，但你可以改变拍手的力度（音量）和间隔（节奏）",
            "打开手机钢琴App，按不同的键感受音高的变化",
          ],
          quiz: {
            id: "q1-1",
            title: "什么是音乐 - 随堂测验",
            questions: [
              {
                id: "q1-1-1",
                type: "single",
                question: "音乐中使用的、有固定音高的音叫做什么？",
                choices: [
                  { id: "a", text: "噪音" },
                  { id: "b", text: "乐音" },
                  { id: "c", text: "和声" },
                  { id: "d", text: "泛音" },
                ],
                correctAnswer: "b",
                explanation:
                  "乐音是有固定音高的音，如钢琴、小提琴发出的音；噪音则没有固定音高，如拍手声。",
              },
              {
                id: "q1-1-2",
                type: "multi",
                question: "乐音的四个基本属性包括哪些？（多选）",
                choices: [
                  { id: "a", text: "音高" },
                  { id: "b", text: "音长" },
                  { id: "c", text: "音量" },
                  { id: "d", text: "音色" },
                ],
                correctAnswer: ["a", "b", "c", "d"],
                explanation:
                  "乐音四大属性：音高（Pitch）、音长（Duration）、音量（Intensity）、音色（Timbre），缺一不可。",
              },
              {
                id: "q1-1-3",
                type: "single",
                question: "音的高低由什么决定？",
                choices: [
                  { id: "a", text: "振幅大小" },
                  { id: "b", text: "振动频率" },
                  { id: "c", text: "发声材料" },
                  { id: "d", text: "持续时间" },
                ],
                correctAnswer: "b",
                explanation:
                  "振动频率决定音高：频率越高，音越高；频率越低，音越低。振幅决定音量大小。",
              },
            ],
          },
        },
        {
          id: "l1-2",
          order: 2,
          title: "音符与休止符",
          subtitle: "音乐的书写语言",
          content: [
            "音符（Note）是记录音高和音长的符号。不同的音符形状代表不同的音长。",
            "基本音符从长到短依次为：\n\n• 全音符（𝅗𝅥）= 4拍\n• 二分音符（𝅗𝅥）= 2拍\n• 四分音符（𝅘𝅥）= 1拍\n• 八分音符（𝅘𝅥𝅮）= 1/2拍\n• 十六分音符（𝅘𝅥𝅯）= 1/4拍",
            "音符之间的关系：每个较短的音符是上一个的一半。可以用附点（.）延长原音符一半的时值。例如：附点四分音符 = 四分音符 + 八分音符 = 1.5拍",
            "休止符（Rest）表示沉默，对应时值的音符有对应时值的休止符：\n\n• 全休止符 = 4拍\n• 二分休止符 = 2拍\n• 四分休止符 = 1拍\n• 八分休止符 = 1/2拍",
          ],
          tips: [
            "用手打拍子，口念「哒」来练习不同时值：全音符「哒———」，四分音符「哒」",
            "记住口诀：全分八十六，每级砍一半",
          ],
          quiz: {
            id: "q1-2",
            title: "音符与休止符 - 随堂测验",
            questions: [
              {
                id: "q1-2-1",
                type: "single",
                question: "一个全音符等于几个四分音符？",
                choices: [
                  { id: "a", text: "2个" },
                  { id: "b", text: "4个" },
                  { id: "c", text: "8个" },
                  { id: "d", text: "16个" },
                ],
                correctAnswer: "b",
                explanation: "全音符 = 4拍，四分音符 = 1拍，所以全音符 = 4个四分音符。",
              },
              {
                id: "q1-2-2",
                type: "single",
                question: "附点四分音符的时值是多少？",
                choices: [
                  { id: "a", text: "1拍" },
                  { id: "b", text: "1.5拍" },
                  { id: "c", text: "2拍" },
                  { id: "d", text: "0.5拍" },
                ],
                correctAnswer: "b",
                explanation:
                  "附点延长原音符一半时值：四分音符1拍 + 一半（0.5拍）= 1.5拍。",
              },
              {
                id: "q1-2-3",
                type: "truefalse",
                question: "休止符也是音乐的重要组成部分，不可缺少的。",
                correctAnswer: "true",
                explanation:
                  "对！休止符让音乐有呼吸和停顿，是「此时无声胜有声」的艺术表现。",
              },
            ],
          },
        },
        {
          id: "l1-3",
          order: 3,
          title: "节拍与节奏",
          subtitle: "音乐的骨架",
          content: [
            "节拍（Beat）是音乐中均匀重复的脉动，就像心跳一样稳定。我们把节拍按照强弱规律分组，就形成了「小节」（Measure/Bar）。",
            "常见的拍号：\n\n• 2/4拍：以四分音符为一拍，每小节2拍。强弱规律：强 弱\n• 3/4拍：以四分音符为一拍，每小节3拍。强弱规律：强 弱 弱（华尔兹）\n• 4/4拍：以四分音符为一拍，每小节4拍。强弱规律：强 弱 次强 弱（最常见）",
            "节奏（Rhythm）是音符长短的组合。同样的音符可以用不同的节奏型来组织，产生不同的感觉。",
            "常见节奏型：\n\n• 平均型：♩ ♩ ♩ ♩（进行曲风格）\n• 附点型：♩. ♪ ♩. ♪（摇摆感）\n• 切分型：♪ ♩ ♪（强调弱拍，有推动力）",
          ],
          tips: [
            "走路时尝试数拍子：1-2-3-4，重拍落在左脚",
            "听一首流行歌，试着用手打出稳定的拍子，感受4/4拍的规律",
          ],
          quiz: {
            id: "q1-3",
            title: "节拍与节奏 - 随堂测验",
            questions: [
              {
                id: "q1-3-1",
                type: "single",
                question: "4/4拍每小节有几拍？",
                choices: [
                  { id: "a", text: "2拍" },
                  { id: "b", text: "3拍" },
                  { id: "c", text: "4拍" },
                  { id: "d", text: "8拍" },
                ],
                correctAnswer: "c",
                explanation:
                  "4/4拍中，上面的数字「4」表示每小节4拍，是最常用的拍号。",
              },
              {
                id: "q1-3-2",
                type: "single",
                question: "华尔兹舞曲通常使用什么拍号？",
                choices: [
                  { id: "a", text: "2/4拍" },
                  { id: "b", text: "3/4拍" },
                  { id: "c", text: "4/4拍" },
                  { id: "d", text: "6/8拍" },
                ],
                correctAnswer: "b",
                explanation:
                  "3/4拍每小节3拍，强弱规律为「强-弱-弱」，形成摇摆感，是华尔兹的标志。",
              },
              {
                id: "q1-3-3",
                type: "truefalse",
                question: "节拍和节奏是同一个概念。",
                correctAnswer: "false",
                explanation:
                  "错误！节拍是均匀的脉动（如心跳），节奏是音符长短的组合。节奏依托于节拍，但两者不同。",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ch2",
      title: "第二章：音高与音阶",
      description: "认识音名唱名，掌握大小调音阶",
      icon: "Piano",
      order: 2,
      lessons: [
        {
          id: "l2-1",
          order: 1,
          title: "音名与唱名",
          subtitle: "do re mi fa sol la si",
          content: [
            "音乐中有两套命名系统：音名和唱名。",
            "音名（Letter Names）：用英文字母 C D E F G A B 表示固定的音高。这是国际通用的命名法。\n\n• C = do\n• D = re\n• E = mi\n• F = fa\n• G = sol\n• A = la\n• B = si（欧美体系）/ ti（部分体系）",
            "唱名（Solfège）：do re mi fa sol la si，用于视唱和相对音高训练。唱名有两种体系：\n\n1. 固定唱名法：do 永远等于 C，与音名一一对应\n2. 首调唱名法：do 等于调的主音，适用于不同调性",
            "对于初学者，建议先掌握音名与唱名的对应关系。钢琴白键从左到右依次是：C D E F G A B，然后循环。",
          ],
          tips: [
            "用《音乐之声》的「Do-Re-Mi」来记忆唱名顺序",
            "钢琴最中间的 C 叫做「中央C」，是钢琴的分界线",
          ],
          quiz: {
            id: "q2-1",
            title: "音名与唱名 - 随堂测验",
            questions: [
              {
                id: "q2-1-1",
                type: "single",
                question: "唱名「sol」对应的音名是什么？",
                choices: [
                  { id: "a", text: "C" },
                  { id: "b", text: "D" },
                  { id: "c", text: "E" },
                  { id: "d", text: "G" },
                ],
                correctAnswer: "d",
                explanation: "G = sol，F = fa，E = mi，这是必须熟记的对应关系。",
              },
              {
                id: "q2-1-2",
                type: "single",
                question: "钢琴白键的音名顺序是？",
                choices: [
                  { id: "a", text: "A B C D E F G" },
                  { id: "b", text: "C D E F G A B" },
                  { id: "c", text: "D E F G A B C" },
                  { id: "d", text: "E F G A B C D" },
                ],
                correctAnswer: "b",
                explanation:
                  "钢琴白键从C开始循环：C D E F G A B。两个白键之间的黑键代表半音。",
              },
              {
                id: "q2-1-3",
                type: "truefalse",
                question: "首调唱名法中，do 的音高会随调性变化。",
                correctAnswer: "true",
                explanation:
                  "对！首调唱名法中，do 始终等于该调的主音。比如G大调中，do = G；F大调中，do = F。",
              },
            ],
          },
        },
        {
          id: "l2-2",
          order: 2,
          title: "半音与全音",
          subtitle: "音阶的基本步伐",
          content: [
            "钢琴上相邻的两个键（包括白键和黑键）之间的距离是「半音」（Semitone/Half Step）。两个半音等于一个「全音」（Whole Step/Tone）。",
            "观察钢琴键盘：\n\n• E-F 之间没有黑键 = 半音\n• B-C 之间没有黑键 = 半音\n• 其他相邻白键之间都有黑键 = 全音",
            "记住这个规律：\n\nC-D 全音 | D-E 全音 | E-F 半音 | F-G 全音 | G-A 全音 | A-B 全音 | B-C 半音",
            "半音和全音是构建音阶的基础。理解了它们，就能推导出任何调的音阶。",
          ],
          tips: [
            "记住「EF和BC是邻居（半音），其他都要隔一个（全音）」",
            "在钢琴上反复弹 E-F 和 C-D，感受半音和全音的差异",
          ],
          quiz: {
            id: "q2-2",
            title: "半音与全音 - 随堂测验",
            questions: [
              {
                id: "q2-2-1",
                type: "single",
                question: "钢琴上 C 到 D 是几个半音？",
                choices: [
                  { id: "a", text: "1个半音" },
                  { id: "b", text: "2个半音（1个全音）" },
                  { id: "c", text: "3个半音" },
                  { id: "d", text: "4个半音" },
                ],
                correctAnswer: "b",
                explanation: "C和D之间隔着一个黑键（C#/Db），所以C-D = 两个半音 = 一个全音。",
              },
              {
                id: "q2-2-2",
                type: "single",
                question: "下列哪组音之间是半音关系？",
                choices: [
                  { id: "a", text: "C - D" },
                  { id: "b", text: "D - E" },
                  { id: "c", text: "E - F" },
                  { id: "d", text: "F - G" },
                ],
                correctAnswer: "c",
                explanation:
                  "E-F 和 B-C 之间没有黑键，所以是半音关系。其他相邻白键之间都是全音。",
              },
              {
                id: "q2-2-3",
                type: "fillblank",
                question: "两个_____等于一个全音。",
                correctAnswer: "半音",
                explanation: "1全音 = 2半音，这是音阶计算的基本单位。",
              },
            ],
          },
        },
        {
          id: "l2-3",
          order: 3,
          title: "大调音阶",
          subtitle: "音乐的基准音阶",
          content: [
            "大调音阶（Major Scale）是西方音乐最基础的音阶，听起来明亮、开阔。它的音程结构是固定的：\n\n全 - 全 - 半 - 全 - 全 - 全 - 半\n（W-W-H-W-W-W-H）",
            "以C大调为例（无升降号）：\n\nC(主音) → D(全) → E(全) → F(半) → G(全) → A(全) → B(全) → C(半)\n\n即：C D E F G A B C",
            "大调音阶的每个音有特定的功能名称：\n\n• 第1音（I级）：主音（Tonic）- 最稳定的音\n• 第2音（II级）：上主音（Supertonic）\n• 第3音（III级）：中音（Mediant）\n• 第4音（IV级）：下属音（Subdominant）\n• 第5音（V级）：属音（Dominant）- 对主音有强烈倾向\n• 第6音（VI级）：下中音（Submediant）\n• 第7音（VII级）：导音（Leading Tone）- 强烈倾向主音\n• 第8音：高音主音",
            "掌握大调音阶后，可以用同样的音程结构推算出其他调的大调音阶。比如G大调：G A B C D E F# G",
          ],
          tips: [
            "用「全全半全全全半」的口诀记忆大调音阶结构",
            "在钢琴上弹出 C大调 和 G大调，感受它们相同的「大调色彩」",
          ],
          quiz: {
            id: "q2-3",
            title: "大调音阶 - 随堂测验",
            questions: [
              {
                id: "q2-3-1",
                type: "single",
                question: "大调音阶的音程结构是？",
                choices: [
                  { id: "a", text: "全-半-全-全-半-全-全" },
                  { id: "b", text: "全-全-半-全-全-全-半" },
                  { id: "c", text: "半-全-全-半-全-全-全" },
                  { id: "d", text: "全-全-全-半-全-全-半" },
                ],
                correctAnswer: "b",
                explanation:
                  "大调音阶：全-全-半-全-全-全-半。记住「两两全，中间夹个半，后面三个全，最后再来半」。",
              },
              {
                id: "q2-3-2",
                type: "single",
                question: "C大调音阶的第5级（属音）是什么？",
                choices: [
                  { id: "a", text: "C" },
                  { id: "b", text: "D" },
                  { id: "c", text: "E" },
                  { id: "d", text: "G" },
                ],
                correctAnswer: "d",
                explanation:
                  "C大调：C(1) D(2) E(3) F(4) G(5) A(6) B(7)。第5级是G，称为「属音」。",
              },
              {
                id: "q2-3-3",
                type: "single",
                question: "G大调音阶中需要升高哪个音？",
                choices: [
                  { id: "a", text: "F" },
                  { id: "b", text: "C" },
                  { id: "c", text: "F" },
                  { id: "d", text: "F#" },
                ],
                correctAnswer: "d",
                explanation:
                  "G大调：G A B C D E F# G。按全全半全全全半的规律，E到F原本是半音，但这里需要全音，所以F要升半音变成F#。",
              },
            ],
          },
        },
        {
          id: "l2-4",
          order: 4,
          title: "小调音阶",
          subtitle: "忧郁而深情的色彩",
          content: [
            "小调音阶（Minor Scale）听起来比大调更暗淡、忧伤，但也可以很深情。有三种常见形式：",
            "自然小调（Natural Minor）：\n全 - 半 - 全 - 全 - 半 - 全 - 全\n（W-H-W-W-H-W-W）\n\n以A自然小调为例：A B C D E F G A",
            "和声小调（Harmonic Minor）：\n将自然小调的第7级升高半音\n\n以A和声小调为例：A B C D E F G# A\n特点：第7级到主音是半音，导音倾向更强",
            "旋律小调（Melodic Minor）：\n上行时升高第6、7级，下行时还原（与自然小调相同）\n\n上行：A B C D E F# G# A\n下行：A G F E D C B A",
            "关系大小调：每个大调都有一个关系小调，它们共用相同的调号。找法：从大调主音往下找小三度。\n\n例如：C大调的关系小调是A小调（C → B → A）；G大调的关系小调是E小调。",
          ],
          tips: [
            "听一首悲伤的歌和一首欢快的歌，对比大小调的情感色彩",
            "关系大小调就像一对兄妹，共用家（调号）但性格（主音）不同",
          ],
          quiz: {
            id: "q2-4",
            title: "小调音阶 - 随堂测验",
            questions: [
              {
                id: "q2-4-1",
                type: "single",
                question: "自然小调的音程结构是？",
                choices: [
                  { id: "a", text: "全-全-半-全-全-全-半" },
                  { id: "b", text: "全-半-全-全-半-全-全" },
                  { id: "c", text: "半-全-全-半-全-全-全" },
                  { id: "d", text: "全-全-半-全-半-全-全" },
                ],
                correctAnswer: "b",
                explanation:
                  "自然小调：全-半-全-全-半-全-全。对比大调，小调第3级和第6级都降低了半音。",
              },
              {
                id: "q2-4-2",
                type: "single",
                question: "C大调的关系小调是？",
                choices: [
                  { id: "a", text: "E小调" },
                  { id: "b", text: "D小调" },
                  { id: "c", text: "A小调" },
                  { id: "d", text: "G小调" },
                ],
                correctAnswer: "c",
                explanation:
                  "从大调主音往下找小三度：C → B → A，所以C大调的关系小调是A小调。",
              },
              {
                id: "q2-4-3",
                type: "truefalse",
                question: "和声小调的特征是第7级升高半音。",
                correctAnswer: "true",
                explanation:
                  "对！和声小调将自然小调的第7级升高半音，使导音到主音成为半音，和声进行更自然。",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ch3",
      title: "第三章：音程与和弦",
      description: "掌握音程计算与和弦构建",
      icon: "AudioLines",
      order: 3,
      lessons: [
        {
          id: "l3-1",
          order: 1,
          title: "音程基础",
          subtitle: "两个音之间的距离",
          content: [
            "音程（Interval）是两个音之间的距离。计算音程需要两个维度：度数和音数。",
            "度数：按音名字母计算的数量（包括起音和终音）。\n\n• C-C = 一度\n• C-D = 二度\n• C-E = 三度\n• C-F = 四度\n• C-G = 五度\n• C-A = 六度\n• C-B = 七度\n• C-高音C = 八度",
            "音程按性质分类：\n\n• 纯音程（Perfect）：一、四、五、八度\n• 大音程（Major）：二、三、六、七度\n• 小音程（Minor）：比大音程少半音\n• 增音程（Augmented）：比纯或大音程多半音\n• 减音程（Diminished）：比纯或小音程少半音",
            "常见音程（以C为根音）：\n\n• 纯一度：C-C（0半音）\n• 小二度：C-Db（1半音）\n• 大二度：C-D（2半音）\n• 小三度：C-Eb（3半音）\n• 大三度：C-E（4半音）\n• 纯四度：C-F（5半音）\n• 三全音/增四度：C-F#（6半音）\n• 纯五度：C-G（7半音）\n• 小六度：C-Ab（8半音）\n• 大六度：C-A（9半音）\n• 小七度：C-Bb（10半音）\n• 大七度：C-B（11半音）\n• 纯八度：C-高音C（12半音）",
          ],
          tips: [
            "先算度数（数字母），再算半音数确定性质",
            "纯五度（7半音）和纯四度（5半音）是音乐和声的基础，加起来正好一个八度（12半音）",
          ],
          quiz: {
            id: "q3-1",
            title: "音程基础 - 随堂测验",
            questions: [
              {
                id: "q3-1-1",
                type: "single",
                question: "C到E是什么音程？",
                choices: [
                  { id: "a", text: "小二度" },
                  { id: "b", text: "大二度" },
                  { id: "c", text: "小三度" },
                  { id: "d", text: "大三度" },
                ],
                correctAnswer: "d",
                explanation:
                  "C到E：度数是3（C-D-E），半音数是4（C-C#-D-D#-E），所以是大三度。",
              },
              {
                id: "q3-1-2",
                type: "single",
                question: "纯五度包含几个半音？",
                choices: [
                  { id: "a", text: "5个" },
                  { id: "b", text: "6个" },
                  { id: "c", text: "7个" },
                  { id: "d", text: "8个" },
                ],
                correctAnswer: "c",
                explanation: "纯五度 = 7个半音。如C-G：C-C#-D-D#-E-F-F#-G，共7个半音。",
              },
              {
                id: "q3-1-3",
                type: "multi",
                question: "下列哪些是「纯音程」？（多选）",
                choices: [
                  { id: "a", text: "一度" },
                  { id: "b", text: "四度" },
                  { id: "c", text: "五度" },
                  { id: "d", text: "八度" },
                ],
                correctAnswer: ["a", "b", "c", "d"],
                explanation:
                  "纯音程包括：一度、四度、五度、八度。二、三、六、七度只有大和小的区分。",
              },
            ],
          },
        },
        {
          id: "l3-2",
          order: 2,
          title: "三和弦",
          subtitle: "三个音的和谐组合",
          content: [
            "和弦（Chord）是三个或更多音同时发声的组合。三和弦（Triad）是最基础和弦，由三个音按三度关系叠置而成。",
            "三和弦的结构：\n\n根音（Root）→ 三音（Third）→ 五音（Fifth）\n（根音上方叠置一个三度，再叠置一个三度）",
            "四种基本三和弦：\n\n• 大三和弦（Major）：大三度 + 小三度\n  例：C-E-G（C大三和弦，记作 C 或 Cmaj）\n  色彩：明亮、稳定\n\n• 小三和弦（Minor）：小三度 + 大三度\n  例：C-Eb-G（C小三和弦，记作 Cm 或 Cmin）\n  色彩：忧伤、柔和\n\n• 增三和弦（Augmented）：大三度 + 大三度\n  例：C-E-G#（C增三和弦，记作 Caug 或 C+）\n  色彩：紧张、扩张\n\n• 减三和弦（Diminished）：小三度 + 小三度\n  例：C-Eb-Gb（C减三和弦，记作 Cdim 或 C°）\n  色彩：悬疑、收缩",
            "记忆口诀：\n大大 = 大，大小 = 小，\n大大大 = 增，小小小 = 减。",
          ],
          tips: [
            "在钢琴上同时按下C-E-G（大三）和C-Eb-G（小三），对比它们的色彩差异",
            "所有三和弦都可以用「根音 + 三音性质 + 五音性质」来分析",
          ],
          quiz: {
            id: "q3-2",
            title: "三和弦 - 随堂测验",
            questions: [
              {
                id: "q3-2-1",
                type: "single",
                question: "C-E-G 是什么和弦？",
                choices: [
                  { id: "a", text: "C小三和弦" },
                  { id: "b", text: "C大三和弦" },
                  { id: "c", text: "C增三和弦" },
                  { id: "d", text: "C减三和弦" },
                ],
                correctAnswer: "b",
                explanation:
                  "C-E是大三度（4半音），E-G是小三度（3半音）。大三度+小三度 = 大三和弦。",
              },
              {
                id: "q3-2-2",
                type: "single",
                question: "小三和弦的音程结构是？",
                choices: [
                  { id: "a", text: "大三度 + 大三度" },
                  { id: "b", text: "大三度 + 小三度" },
                  { id: "c", text: "小三度 + 大三度" },
                  { id: "d", text: "小三度 + 小三度" },
                ],
                correctAnswer: "c",
                explanation:
                  "小三和弦 = 小三度 + 大三度。如Cm：C-Eb（小三度）+ Eb-G（大三度）。",
              },
              {
                id: "q3-2-3",
                type: "single",
                question: "减三和弦的音程结构是？",
                choices: [
                  { id: "a", text: "大三度 + 小三度" },
                  { id: "b", text: "小三度 + 大三度" },
                  { id: "c", text: "大三度 + 大三度" },
                  { id: "d", text: "小三度 + 小三度" },
                ],
                correctAnswer: "d",
                explanation:
                  "减三和弦 = 小三度 + 小三度。如Cdim：C-Eb（小三度）+ Eb-Gb（小三度）。",
              },
            ],
          },
        },
        {
          id: "l3-3",
          order: 3,
          title: "七和弦与和弦转位",
          subtitle: "更丰富的和声色彩",
          content: [
            "七和弦（Seventh Chord）在三和弦基础上再叠加一个三度，形成四个音的和弦。根音到最高音是七度，因此得名。",
            "常见七和弦：\n\n• 大七和弦（Maj7）：大三和弦 + 大七度\n  例：C-E-G-B（记作 Cmaj7 或 C△7）\n  色彩：明亮、开阔、爵士感\n\n• 属七和弦（Dominant 7）：大三和弦 + 小七度\n  例：C-E-G-Bb（记作 C7）\n  色彩：紧张、需要解决、 Blues感\n  注意：这是最常用的七和弦！\n\n• 小七和弦（Minor 7）：小三和弦 + 小七度\n  例：C-Eb-G-Bb（记作 Cm7 或 Cmin7）\n  色彩：柔和、内敛\n\n• 半减七和弦（Half-diminished 7 / m7b5）：减三和弦 + 小七度\n  例：C-Eb-Gb-Bb（记作 Cø7 或 Cm7b5）\n  色彩：悬疑、过渡性",
            "和弦转位（Inversion）：将和弦的最低音换成其他音，改变低音位置但不改变和弦性质。\n\n• 原位（Root position）：根音在最低音\n• 第一转位（1st inversion）：三音在最低音\n• 第二转位（2nd inversion）：五音在最低音\n• 第三转位（3rd inversion，七和弦）：七音在最低音",
            "转位标记（数字低音）：\n• 原位：C\n• 第一转位：C/E（ slash chord，C和弦以E为低音）\n• 第二转位：C/G",
          ],
          tips: [
            "属七和弦（C7）是流行音乐和Blues的核心，一定要熟练掌握",
            "转位不改变和弦性质，但改变了低音线条，让和声进行更流畅",
          ],
          quiz: {
            id: "q3-3",
            title: "七和弦与转位 - 随堂测验",
            questions: [
              {
                id: "q3-3-1",
                type: "single",
                question: "C-E-G-Bb 是什么和弦？",
                choices: [
                  { id: "a", text: "C大七和弦" },
                  { id: "b", text: "C属七和弦" },
                  { id: "c", text: "C小七和弦" },
                  { id: "d", text: "C减七和弦" },
                ],
                correctAnswer: "b",
                explanation:
                  "C-E-G是大三和弦，C-Bb是小七度（10半音）。大三和弦+小七度 = 属七和弦 C7。",
              },
              {
                id: "q3-3-2",
                type: "single",
                question: "C/E 表示什么意思？",
                choices: [
                  { id: "a", text: "C和弦转位，E为最低音" },
                  { id: "b", text: "E和弦转位，C为最低音" },
                  { id: "c", text: "C和E两个和弦同时演奏" },
                  { id: "d", text: "C大调E小调转换" },
                ],
                correctAnswer: "a",
                explanation:
                  "Slash chord（斜杠和弦）中，斜杠前是和弦名，斜杠后是低音。C/E = C和弦的第一转位。",
              },
              {
                id: "q3-3-3",
                type: "multi",
                question: "下列哪些和弦属于七和弦？（多选）",
                choices: [
                  { id: "a", text: "大七和弦" },
                  { id: "b", text: "属七和弦" },
                  { id: "c", text: "小七和弦" },
                  { id: "d", text: "半减七和弦" },
                ],
                correctAnswer: ["a", "b", "c", "d"],
                explanation: "这些都是七和弦的不同类型，在三和弦基础上叠加七音形成。",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ch4",
      title: "第四章：调式与调性",
      description: "理解调号系统与调的关系",
      icon: "CircleDot",
      order: 4,
      lessons: [
        {
          id: "l4-1",
          order: 1,
          title: "调号",
          subtitle: "升降号的规律",
          content: [
            "调号（Key Signature）写在谱号后面，表示该调中需要固定升高或降低的音。",
            "升号调（Sharp Keys）：按照「FCGDAEB」的顺序累加升号\n\n• 0个#：C大调 / A小调\n• 1个#（F#）：G大调 / E小调\n• 2个#（F# C#）：D大调 / B小调\n• 3个#（F# C# G#）：A大调 / F#小调\n• 4个#（F# C# G# D#）：E大调 / C#小调\n• 5个#：B大调 / G#小调\n• 6个#：F#大调 / D#小调\n• 7个#：C#大调 / A#小调",
            "降号调（Flat Keys）：按照「BEADGCF」的顺序累加降号（刚好是升号的倒序）\n\n• 0个b：C大调 / A小调\n• 1个b（Bb）：F大调 / D小调\n• 2个b（Bb Eb）：Bb大调 / G小调\n• 3个b（Bb Eb Ab）：Eb大调 / C小调\n• 4个b：Ab大调 / F小调\n• 5个b：Db大调 / Bb小调\n• 6个b：Gb大调 / Eb小调\n• 7个b：Cb大调 / Ab小调",
            "快速找调名的方法：\n\n• 升号调：最后一个升号上方小二度 = 大调主音\n  例：F# C# G# → 最后一个#是G#，上方小二度是A → A大调\n\n• 降号调：倒数第二个降号 = 大调主音（1个b时是F大调）\n  例：Bb Eb Ab Db → 倒数第二个b是Ab → Ab大调",
          ],
          tips: [
            "记住「五升六降是极限，七个升降是同音异名」",
            "升号顺序：Father Charles Goes Down And Ends Battle\n降号顺序：Battle Ends And Down Goes Charles' Father",
          ],
          quiz: {
            id: "q4-1",
            title: "调号 - 随堂测验",
            questions: [
              {
                id: "q4-1-1",
                type: "single",
                question: "调号有3个升号（F# C# G#）是什么大调？",
                choices: [
                  { id: "a", text: "D大调" },
                  { id: "b", text: "E大调" },
                  { id: "c", text: "A大调" },
                  { id: "d", text: "G大调" },
                ],
                correctAnswer: "c",
                explanation:
                  "最后一个升号是G#，上方小二度是A，所以是A大调。",
              },
              {
                id: "q4-1-2",
                type: "single",
                question: "F大调的调号有几个降号？",
                choices: [
                  { id: "a", text: "0个" },
                  { id: "b", text: "1个" },
                  { id: "c", text: "2个" },
                  { id: "d", text: "3个" },
                ],
                correctAnswer: "b",
                explanation:
                  "F大调有1个降号（Bb）。这是唯一一个降号大调用「倒数第二个」方法不适用的情况。",
              },
              {
                id: "q4-1-3",
                type: "fillblank",
                question: "升号调的顺序是 F-C-G-D-A-E-_____。",
                correctAnswer: "B",
                explanation:
                  "升号调顺序：FCGDAEB。记住口诀 Father Charles Goes Down And Ends Battle。",
              },
            ],
          },
        },
        {
          id: "l4-2",
          order: 2,
          title: "五度圈",
          subtitle: "调与调之间的关系地图",
          content: [
            "五度圈（Circle of Fifths）是音乐理论中最重要的工具之一，它展示了所有调之间的关系。",
            "顺时针方向：每步增加一个升号（纯五度上行）\nC → G（1#）→ D（2#）→ A（3#）→ E（4#）→ B（5#）→ F#（6#）→ C#（7#）",
            "逆时针方向：每步增加一个降号（纯五度下行/纯四度上行）\nC → F（1b）→ Bb（2b）→ Eb（3b）→ Ab（4b）→ Db（5b）→ Gb（6b）→ Cb（7b）",
            "五度圈的用途：\n\n1. 快速查找调号\n2. 找近系调（相邻的调关系最近，共同和弦最多）\n3. 找关系大小调（内外圈对应）\n4. 理解和声进行（如 ii-V-I 就在五度圈上）\n5. 转调时的桥梁选择",
            "近系调（Closely Related Keys）：五度圈上相差不超过一个位置的调。\n\n例如C大调的近系调：G大调、F大调、A小调、E小调、D小调。",
          ],
          tips: [
            "画一个五度圈贴在墙上，每天看一遍，一周后就能熟记",
            "五度圈顺时针是纯五度上行，逆时针是纯五度下行",
          ],
          quiz: {
            id: "q4-2",
            title: "五度圈 - 随堂测验",
            questions: [
              {
                id: "q4-2-1",
                type: "single",
                question: "五度圈中，C大调顺时针方向的下一个调是？",
                choices: [
                  { id: "a", text: "F大调" },
                  { id: "b", text: "G大调" },
                  { id: "c", text: "D大调" },
                  { id: "d", text: "A大调" },
                ],
                correctAnswer: "b",
                explanation:
                  "顺时针是纯五度上行：C → G（纯五度），G调增加一个升号。",
              },
              {
                id: "q4-2-2",
                type: "single",
                question: "C大调的关系小调在五度圈的什么位置？",
                choices: [
                  { id: "a", text: "C大调的内圈" },
                  { id: "b", text: "C大调的外圈" },
                  { id: "c", text: "C大调顺时针1位" },
                  { id: "d", text: "C大调逆时针1位" },
                ],
                correctAnswer: "a",
                explanation:
                  "五度圈通常画成内外两圈，外圈是大调，内圈是对应的关系小调。C大调内圈是A小调。",
              },
              {
                id: "q4-2-3",
                type: "multi",
                question: "五度圈的用途包括？（多选）",
                choices: [
                  { id: "a", text: "查找调号" },
                  { id: "b", text: "找近系调" },
                  { id: "c", text: "理解和声进行" },
                  { id: "d", text: "确定演奏速度" },
                ],
                correctAnswer: ["a", "b", "c"],
                explanation:
                  "五度圈与演奏速度无关。它是调性关系的地图，用于调号、近系调、和声分析等。",
              },
            ],
          },
        },
      ],
    },
    {
      id: "ch5",
      title: "第五章：读谱与综合",
      description: "五线谱基础与综合应用",
      icon: "BookOpen",
      order: 5,
      lessons: [
        {
          id: "l5-1",
          order: 1,
          title: "五线谱基础",
          subtitle: "音乐的书面语言",
          content: [
            "五线谱（Staff）由五条平行的横线和四个间组成，从下往上数：线1、间1、线2、间2……",
            "谱号（Clef）决定每条线/间代表什么音高：\n\n• 高音谱号（G谱号，𝄞）：第二线是G（sol）\n  适用于：小提琴、长笛、钢琴右手、女声\n\n• 低音谱号（F谱号，𝄢）：第四线是F（fa）\n  适用于：大提琴、低音提琴、钢琴左手、男声\n\n• 中音谱号（C谱号，𝄡）：中线是中央C\n  适用于：中提琴",
            "高音谱号上的音（从下往上）：\n\n线下：E（线1）G（线2）B（线3）D（线4）F（线5）\n间中：F（间1）A（间2）C（间3）E（间4）\n\n记忆口诀：\n线：Every Good Boy Deserves Favour（E-G-B-D-F）\n间：FACE（F-A-C-E）",
            "低音谱号上的音（从下往上）：\n\n线：G-B-D-F-A\n间：A-C-E-G\n\n记忆口诀：\n线：Good Boys Do Fine Always\n间：All Cows Eat Grass（与上加线配合使用）",
            "中央C（Middle C）在高音谱号下加一线，也在低音谱号上加一线。大谱表（Grand Staff）将高低音谱表用大括号连起来，钢琴谱就是这种形式。",
          ],
          tips: [
            "每天花5分钟认谱，从高音谱号开始，逐渐加入低音谱号",
            "用「FACE」记高音谱号的间，用「EGBDF」记高音谱号的线",
          ],
          quiz: {
            id: "q5-1",
            title: "五线谱基础 - 随堂测验",
            questions: [
              {
                id: "q5-1-1",
                type: "single",
                question: "高音谱号的第二线是什么音？",
                choices: [
                  { id: "a", text: "E" },
                  { id: "b", text: "F" },
                  { id: "c", text: "G" },
                  { id: "d", text: "A" },
                ],
                correctAnswer: "c",
                explanation:
                  "高音谱号又叫G谱号，那个旋涡中心就缠绕在第二线上，表示第二线是G（sol）。",
              },
              {
                id: "q5-1-2",
                type: "single",
                question: "低音谱号的第四线是什么音？",
                choices: [
                  { id: "a", text: "D" },
                  { id: "b", text: "E" },
                  { id: "c", text: "F" },
                  { id: "d", text: "G" },
                ],
                correctAnswer: "c",
                explanation:
                  "低音谱号又叫F谱号，两个点夹着第四线，表示第四线是F（fa）。",
              },
              {
                id: "q5-1-3",
                type: "single",
                question: "钢琴大谱表中，高音谱号的下加一线和低音谱号的上加一线是什么音？",
                choices: [
                  { id: "a", text: "G" },
                  { id: "b", text: "A" },
                  { id: "c", text: "中央C" },
                  { id: "d", text: "E" },
                ],
                correctAnswer: "c",
                explanation:
                  "这两个位置都是中央C（Middle C），是连接高低音谱表的桥梁。",
              },
            ],
          },
        },
        {
          id: "l5-2",
          order: 2,
          title: "常用记号",
          subtitle: "让乐谱更精确",
          content: [
            "演奏记号（Performance Marks）告诉演奏者如何表达音乐：\n\n• 连音线（Slur，弧线）：连线内的音要连贯演奏（Legato）\n• 断奏（Staccato，小圆点）：音要短促、清晰\n• 重音（Accent，>）：加强该音的力度\n• 延长记号（Fermata，𝄐）：该音/休止符适当延长\n• 渐强（Crescendo，<）：逐渐变强\n• 渐弱（Decrescendo/Diminuendo，>）：逐渐变弱",
            "反复记号（Repeat Signs）：\n\n• ||: :|| 之间的内容反复一遍\n• D.C.（Da Capo）：从头反复\n• D.S.（Dal Segno）：从记号𝄋处反复\n• Fine：结束\n• Coda（𝄌）：尾声，跳到结尾段落",
            "装饰音（Ornaments）：\n\n• 倚音（Appoggiatura）：小音符，占主要音的部分时值\n• 波音（Mordent）：主音与上方/下方邻音快速交替\n• 回音（Turn）：围绕主音的四个音快速进行\n• 颤音（Trill，tr～）：主音与上方邻音快速交替",
            "速度术语（Tempo）：\n\n• Grave：庄板（极慢）\n• Largo：广板（很慢）\n• Adagio：柔板（慢）\n• Andante：行板（步行速度）\n• Moderato：中板（中等速度）\n• Allegro：快板（快）\n• Presto：急板（很快）",
          ],
          tips: [
            "速度术语大多是意大利语，因为古典音乐传统源自意大利",
            "装饰音的具体奏法因时期和作曲家而异，需结合上下文理解",
          ],
          quiz: {
            id: "q5-2",
            title: "常用记号 - 随堂测验",
            questions: [
              {
                id: "q5-2-1",
                type: "single",
                question: "音符上方的小圆点表示什么演奏法？",
                choices: [
                  { id: "a", text: "连奏" },
                  { id: "b", text: "断奏" },
                  { id: "c", text: "重音" },
                  { id: "d", text: "延长" },
                ],
                correctAnswer: "b",
                explanation:
                  "小圆点（Staccato）表示断奏，音要弹得短促有力，时值约为原来的一半。",
              },
              {
                id: "q5-2-2",
                type: "single",
                question: "D.C. 是什么意思？",
                choices: [
                  { id: "a", text: "从记号处反复" },
                  { id: "b", text: "从头反复" },
                  { id: "c", text: "跳到尾声" },
                  { id: "d", text: "结束" },
                ],
                correctAnswer: "b",
                explanation:
                  "D.C. = Da Capo（意大利语「从头」），表示回到乐曲开头重新演奏。",
              },
              {
                id: "q5-2-3",
                type: "single",
                question: "Allegro 表示什么速度？",
                choices: [
                  { id: "a", text: "很慢" },
                  { id: "b", text: "中等" },
                  { id: "c", text: "快" },
                  { id: "d", text: "极慢" },
                ],
                correctAnswer: "c",
                explanation:
                  "Allegro 是快板，表示较快的速度，大约 120-168 BPM。",
              },
            ],
          },
        },
        {
          id: "l5-3",
          order: 3,
          title: "和弦进行基础",
          subtitle: "流行音乐的骨架",
          content: [
            "和弦进行（Chord Progression）是按照一定规律排列的和弦序列，是歌曲的「和声骨架」。",
            "用罗马数字标记和弦（以调内音级为基础）：\n\n大调中：\nI = 主和弦（C）\nii = 上主和弦（Dm）\niii = 中和弦（Em）\nIV = 下属和弦（F）\nV = 属和弦（G）\nvi = 下中和弦（Am）\nvii° = 导和弦（Bdim）",
            "最常见的和弦进行：\n\n1. I-V-vi-IV（C-G-Am-F）\n   无数流行歌都在用：《Someone Like You》《Let It Be》《I'm Yours》\n\n2. I-IV-V（C-F-G）\n   蓝调、摇滚、儿歌的经典进行\n\n3. ii-V-I（Dm7-G7-Cmaj7）\n   爵士乐的灵魂进行\n\n4. I-V-vi-iii-IV-I-IV-V（卡农进行）\n   《卡农》的经典变体，极其优美\n\n5. vi-IV-I-V（Am-F-C-G）\n   与I-V-vi-IV类似，但从小调开始，更忧伤",
            "功能分组：\n\n• 主功能（Tonic）：I、vi - 稳定、归宿感\n• 下属功能（Subdominant）：ii、IV - 开放、展开感\n• 属功能（Dominant）：V、vii° - 紧张、需要解决到主和弦",
            "好的和弦进行就像讲故事：主（家）→ 下属（离开）→ 属（紧张）→ 主（回家）。",
          ],
          tips: [
            "拿起吉他或打开钢琴，弹几遍 C-G-Am-F，你会发现很多歌都能套进去",
            "试着把 I-V-vi-IV 换成不同的调，感受相同的「和声色彩」",
          ],
          quiz: {
            id: "q5-3",
            title: "和弦进行 - 随堂测验",
            questions: [
              {
                id: "q5-3-1",
                type: "single",
                question: "C大调中，V级和弦是？",
                choices: [
                  { id: "a", text: "C和弦" },
                  { id: "b", text: "F和弦" },
                  { id: "c", text: "G和弦" },
                  { id: "d", text: "Am和弦" },
                ],
                correctAnswer: "c",
                explanation:
                  "C大调音阶：C(1) D(2) E(3) F(4) G(5) A(6) B(7)。第5级是G，所以V级和弦是G和弦。",
              },
              {
                id: "q5-3-2",
                type: "single",
                question: "流行音乐中最常用的进行之一是？",
                choices: [
                  { id: "a", text: "I-IV-V" },
                  { id: "b", text: "I-V-vi-IV" },
                  { id: "c", text: "ii-V-I" },
                  { id: "d", text: "以上都是" },
                ],
                correctAnswer: "d",
                explanation:
                  "这三个都是极其常见的进行：I-IV-V是蓝调/摇滚基础，I-V-vi-IV是流行金曲进行，ii-V-I是爵士核心。",
              },
              {
                id: "q5-3-3",
                type: "multi",
                question: "哪些和弦属于「主功能组」？（多选）",
                choices: [
                  { id: "a", text: "I级" },
                  { id: "b", text: "IV级" },
                  { id: "c", text: "V级" },
                  { id: "d", text: "vi级" },
                ],
                correctAnswer: ["a", "d"],
                explanation:
                  "主功能组包括I级（最稳定）和vi级（关系小调的主和弦），都有稳定、归宿的感觉。",
              },
            ],
          },
        },
        {
          id: "l5-4",
          order: 4,
          title: "综合复习与展望",
          subtitle: "你已经掌握了乐理基础！",
          content: [
            "恭喜你完成了「乐理基础全攻略」的全部课程！让我们回顾你学到的核心知识：",
            "📚 知识体系回顾：\n\n1. 音乐基础\n   ✓ 乐音四要素：音高、音长、音量、音色\n   ✓ 音符与休止符的时值\n   ✓ 节拍、节奏与拍号\n\n2. 音高与音阶\n   ✓ 音名（C D E F G A B）与唱名（do re mi）\n   ✓ 半音与全音\n   ✓ 大调音阶：全全半全全全半\n   ✓ 小调音阶及其三种形式\n\n3. 音程与和弦\n   ✓ 音程的度数与性质\n   ✓ 三和弦：大、小、增、减\n   ✓ 七和弦与转位\n\n4. 调式与调性\n   ✓ 调号的规律与快速识别\n   ✓ 五度圈与近系调\n\n5. 读谱与应用\n   ✓ 五线谱与谱号\n   ✓ 演奏记号与术语\n   ✓ 和弦进行",
            "🎹 下一步建议：\n\n1. 选择一门乐器：钢琴是最适合理解乐理的乐器，吉他也是很好的选择\n2. 继续深入学习：和声学、曲式分析、对位法\n3. 实践应用：尝试为简单的旋律配和弦，或分析你喜欢的歌曲用了什么和弦进行\n4. 视唱练耳：培养听辨音程、和弦、调性的能力",
            "记住：乐理不是束缚，而是工具。掌握了这些知识，你就能更自由地理解和创造音乐。祝你的音乐之旅愉快！",
          ],
          tips: [
            "每天保持15-30分钟的学习或练习，比偶尔突击更有效",
            "找到一起学音乐的朋友，互相讨论和演奏能加速进步",
          ],
          quiz: {
            id: "q5-4",
            title: "综合结业考核",
            questions: [
              {
                id: "q5-4-1",
                type: "single",
                question: "G大调的调号有几个升号？",
                choices: [
                  { id: "a", text: "0个" },
                  { id: "b", text: "1个" },
                  { id: "c", text: "2个" },
                  { id: "d", text: "3个" },
                ],
                correctAnswer: "b",
                explanation: "G大调有1个升号（F#）。",
              },
              {
                id: "q5-4-2",
                type: "single",
                question: "C-E-G 是什么和弦？",
                choices: [
                  { id: "a", text: "小三和弦" },
                  { id: "b", text: "大三和弦" },
                  { id: "c", text: "属七和弦" },
                  { id: "d", text: "减三和弦" },
                ],
                correctAnswer: "b",
                explanation: "C-E是大三度，E-G是小三度，大三+小三 = 大三和弦。",
              },
              {
                id: "q5-4-3",
                type: "single",
                question: "自然小调的音程结构是？",
                choices: [
                  { id: "a", text: "全-全-半-全-全-全-半" },
                  { id: "b", text: "全-半-全-全-半-全-全" },
                  { id: "c", text: "半-全-全-半-全-全-全" },
                  { id: "d", text: "全-全-全-半-全-全-半" },
                ],
                correctAnswer: "b",
                explanation: "自然小调：全-半-全-全-半-全-全。",
              },
              {
                id: "q5-4-4",
                type: "single",
                question: "纯五度包含几个半音？",
                choices: [
                  { id: "a", text: "5个" },
                  { id: "b", text: "6个" },
                  { id: "c", text: "7个" },
                  { id: "d", text: "8个" },
                ],
                correctAnswer: "c",
                explanation: "纯五度 = 7个半音。",
              },
              {
                id: "q5-4-5",
                type: "single",
                question: "高音谱号的第二线是什么音？",
                choices: [
                  { id: "a", text: "E" },
                  { id: "b", text: "F" },
                  { id: "c", text: "G" },
                  { id: "d", text: "A" },
                ],
                correctAnswer: "c",
                explanation: "高音谱号缠绕在第二线上，表示第二线是G。",
              },
            ],
          },
        },
      ],
    },
  ],
};

export const getAllLessons = () => {
  const lessons: { chapter: typeof musicTheoryCourse.chapters[0]; lesson: typeof musicTheoryCourse.chapters[0]["lessons"][0] }[] = [];
  for (const chapter of musicTheoryCourse.chapters) {
    for (const lesson of chapter.lessons) {
      lessons.push({ chapter, lesson });
    }
  }
  return lessons;
};

export const getLessonById = (id: string) => {
  for (const chapter of musicTheoryCourse.chapters) {
    const lesson = chapter.lessons.find((l) => l.id === id);
    if (lesson) return { chapter, lesson };
  }
  return null;
};

export const getNextLesson = (currentId: string) => {
  const all = getAllLessons();
  const idx = all.findIndex(({ lesson }) => lesson.id === currentId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
};

export const getPrevLesson = (currentId: string) => {
  const all = getAllLessons();
  const idx = all.findIndex(({ lesson }) => lesson.id === currentId);
  return idx > 0 ? all[idx - 1] : null;
};
